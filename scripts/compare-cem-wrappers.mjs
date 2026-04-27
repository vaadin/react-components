#!/usr/bin/env node
/**
 * compare-cem-wrappers.mjs
 *
 * Regenerates the React wrappers twice — once against the @vaadin/* packages
 * currently on the npm registry (baseline) and once against a sibling
 * vaadin/web-components checkout (candidate, expected to carry CEM-generated
 * web-types.json). Diffs the two `src/generated` trees and writes a
 * categorized markdown report to `.cem-comparison/REPORT.md`.
 *
 * See CLAUDE.md for repo layout and
 * ../web-components/CEM-MIGRATION.md for the A/B/C/D categorization.
 *
 * Usage:
 *   node scripts/compare-cem-wrappers.mjs [options]
 *
 * Options:
 *   --web-components-dir <path>  Path to sibling checkout (default ../web-components)
 *   --skip-sibling-build         Don't rebuild CEM + web-types in the sibling
 *   --skip-baseline              Reuse existing .cem-comparison/baseline
 *   --no-validate                Skip validate:types and validate:build passes
 *   --no-cleanup                 Leave candidate state in node_modules after run
 *   --help                       Show this message
 */

import { spawn } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
  process.exit(0);
}

const siblingDir = resolve(args['web-components-dir'] ?? resolve(repoRoot, '../web-components'));
const workDir = resolve(repoRoot, '.cem-comparison');
const savedDir = resolve(workDir, 'saved');
const baselineDir = resolve(workDir, 'baseline');
const candidateDir = resolve(workDir, 'candidate');
const reportPath = resolve(workDir, 'REPORT.md');
const validateLogPath = resolve(workDir, 'validate.log');

const PACKAGES = [
  { name: 'react-components', pkgJson: 'packages/react-components/package.json', generated: 'packages/react-components/src/generated' },
  { name: 'react-components-pro', pkgJson: 'packages/react-components-pro/package.json', generated: 'packages/react-components-pro/src/generated' },
];

// ---------------------------------------------------------------------------
// Migration-doc categories (from web-components/CEM-MIGRATION.md)
// ---------------------------------------------------------------------------

const EXPECTED_EVENT_DROPS = {
  // A3 — value-changed dropped on components that expose checked-/selected-items-changed
  Checkbox: ['value-changed'],
  RadioButton: ['value-changed'],
  MultiSelectComboBox: ['value-changed', 'input'],
  // A4 — internal event swallowed by <vaadin-crud>
  CrudEdit: ['edit'],
  // A5 — forwarded native input is not public API
  ComboBox: ['input'],
  DatePicker: ['input'],
  TimePicker: ['input'],
  // A6 — window-level event, not a component event
  AppLayout: ['close-overlay-drawer'],
};

// Mirrors the B1 table in ../web-components/CEM-MIGRATION.md exactly.
const EXPECTED_EVENT_ADDITIONS = {
  ContextMenu: ['close-all-menus', 'items-outside-click'],
  Dashboard: ['dashboard-root-heading-level-changed'],
  DashboardLayout: ['dashboard-root-heading-level-changed'],
  DashboardSection: ['item-move-mode-changed', 'item-resize-mode-changed', 'item-selected-changed'],
  DashboardWidget: ['item-move-mode-changed', 'item-resize-mode-changed', 'item-selected-changed'],
  DatePicker: ['unparsable-change'],
  DateTimePicker: ['unparsable-change'],
  GridFilter: ['filter-changed'],
  GridSorter: ['sorter-changed'],
  IntegerField: ['unparsable-change'],
  NumberField: ['unparsable-change'],
  RichTextEditor: ['change'],
  TimePicker: ['unparsable-change'],
  Upload: ['file-remove'],
};

const REGRESSION_MISSING_EVENTS = {
  // C1 — must be fixed upstream with @fires annotations in web-components
  GridPro: ['enter-next-row-changed', 'single-cell-edit-changed'],
  GridProEditColumn: ['editor-type-changed'],
};

// ---------------------------------------------------------------------------

async function main() {
  if (args['report-only']) {
    if (!existsSync(baselineDir) || !existsSync(candidateDir)) {
      throw new Error(`--report-only requires ${baselineDir} and ${candidateDir} to already exist`);
    }
    logStep('Regenerating report from existing snapshots');
    await writeReport();
    console.log('\n✔ Done.');
    console.log(`Report: ${relative(repoRoot, reportPath)}`);
    return;
  }

  logStep('Pre-flight');
  await preflight();

  await mkdir(workDir, { recursive: true });
  await mkdir(savedDir, { recursive: true });

  let candidateActive = false;
  try {
    if (!args['skip-sibling-build']) {
      logStep('Building CEM + web-types in sibling web-components');
      await buildSibling();
    } else {
      logStep('Skipping sibling build (--skip-sibling-build)');
    }

    if (!args['skip-baseline']) {
      logStep('Capturing BASELINE (registry @vaadin packages)');
      await captureBaseline();
    } else {
      logStep('Skipping baseline capture (--skip-baseline)');
      if (!existsSync(baselineDir)) {
        throw new Error(`--skip-baseline requires ${baselineDir} to already exist`);
      }
    }

    logStep('Switching node_modules to sibling packages');
    // Flip BEFORE the mutation starts so cleanup runs even on a partial failure.
    candidateActive = true;
    await switchToCandidate();

    logStep('Capturing CANDIDATE (sibling @vaadin packages)');
    await captureCandidate();

    if (args.validate !== false) {
      logStep('Running validate:types and validate:build against candidate');
      await runValidation();
    } else {
      logStep('Skipping validation (--no-validate)');
    }
  } finally {
    if (candidateActive && args.cleanup !== false) {
      logStep('Cleanup: restoring registry @vaadin packages');
      try {
        await cleanup();
      } catch (err) {
        console.error('Cleanup failed:', err.message);
        console.error('Run `git checkout -- package.json package-lock.json && npm ci && npm run build` to restore manually.');
      }
    } else if (candidateActive) {
      console.log('⚠ --no-cleanup: node_modules still points at sibling.');
      console.log('  To restore: `git checkout -- package.json package-lock.json && npm ci && npm run build`');
    }
  }

  logStep('Generating diff report');
  await writeReport();

  console.log('\n✔ Done.');
  console.log(`Report: ${relative(repoRoot, reportPath)}`);
}

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

async function preflight() {
  if (!existsSync(siblingDir)) {
    throw new Error(`Sibling web-components checkout not found at ${siblingDir}. Pass --web-components-dir <path>.`);
  }
  if (!existsSync(resolve(siblingDir, 'packages'))) {
    throw new Error(`${siblingDir} doesn't look like a web-components checkout (no packages/ dir)`);
  }
  try {
    const branch = (await runCapture('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: siblingDir })).trim();
    if (branch !== 'chore/cem-web-types') {
      console.log(`ℹ sibling is on branch "${branch}" (expected "chore/cem-web-types" per CEM-MIGRATION.md) — proceeding anyway`);
    } else {
      console.log(`✓ sibling on branch ${branch}`);
    }
  } catch {
    console.log('ℹ could not read sibling branch — proceeding');
  }

  const all = await collectAllVaadinDeps();
  const missing = all.filter((n) => !existsSync(siblingPackageDir(n)));
  if (missing.length > 0) {
    console.log(`ℹ ${missing.length} @vaadin deps have no sibling dir (will stay on registry): ${missing.join(', ')}`);
  }
  const overridable = all.filter((n) => existsSync(siblingPackageDir(n)));
  console.log(`✓ ${overridable.length} @vaadin deps will be overridden to sibling file: paths`);
}

async function buildSibling() {
  const hasYarnLock = existsSync(resolve(siblingDir, 'yarn.lock'));
  if (hasYarnLock) {
    try {
      await run('yarn', ['install', '--frozen-lockfile'], { cwd: siblingDir });
    } catch {
      console.log('↺ --frozen-lockfile failed, retrying with `yarn install`');
      await run('yarn', ['install'], { cwd: siblingDir });
    }
  } else {
    console.log('ℹ no yarn.lock found — skipping `yarn install`');
  }
  await run('yarn', ['release:cem'], { cwd: siblingDir });
  await run('yarn', ['release:web-types'], { cwd: siblingDir });
  if (!existsSync(resolve(siblingDir, 'packages/button/web-types.json'))) {
    throw new Error('Sibling build finished but packages/button/web-types.json is missing — abort.');
  }
}

async function captureBaseline() {
  await rm(baselineDir, { recursive: true, force: true });
  await mkdir(baselineDir, { recursive: true });

  // Snapshot every file we're going to rewrite so cleanup() can restore them.
  await cp(resolve(repoRoot, 'package.json'), resolve(savedDir, 'package.json'));
  if (existsSync(resolve(repoRoot, 'package-lock.json'))) {
    await cp(resolve(repoRoot, 'package-lock.json'), resolve(savedDir, 'package-lock.json'));
  }
  for (const pkg of PACKAGES) {
    const savedPkg = resolve(savedDir, `${pkg.name}.package.json`);
    await cp(resolve(repoRoot, pkg.pkgJson), savedPkg);
  }

  await run('npm', ['ci'], { cwd: repoRoot });
  await run('npm', ['run', 'build:load-schema'], { cwd: repoRoot });
  for (const pkg of PACKAGES) {
    await run('npm', ['run', 'build:generate', '-w', `packages/${pkg.name}`], { cwd: repoRoot });
  }
  for (const pkg of PACKAGES) {
    await copyDir(resolve(repoRoot, pkg.generated), resolve(baselineDir, pkg.name));
  }
  await snapshotVaadinWebTypes(resolve(baselineDir, 'web-types'));
}

async function switchToCandidate() {
  // Rewrite each workspace package.json's @vaadin/* deps to point at the
  // sibling checkout via `file:` specifiers. Root-level `overrides` don't
  // reliably replace deps declared directly on workspace packages (npm often
  // dedupes back to the registry version), so we modify the workspace
  // manifests themselves. cleanup() restores them from savedDir.
  let swapped = 0;
  for (const pkg of PACKAGES) {
    const pkgJsonPath = resolve(repoRoot, pkg.pkgJson);
    const manifest = JSON.parse(await readFile(pkgJsonPath, 'utf8'));
    for (const dep of Object.keys(manifest.dependencies ?? {})) {
      if (!dep.startsWith('@vaadin/')) continue;
      if (dep === '@vaadin/react-components' || dep === '@vaadin/react-components-pro') continue;
      const siblingPath = siblingPackageDir(dep);
      if (!existsSync(siblingPath)) continue;
      manifest.dependencies[dep] = `file:${siblingPath}`;
      swapped += 1;
    }
    await writeFile(pkgJsonPath, JSON.stringify(manifest, null, 2) + '\n');
  }
  console.log(`✓ rewrote ${swapped} workspace deps to file: specifiers`);

  // Clear lockfile + node_modules so npm resolves fresh against the new specs.
  // `--ignore-scripts` skips workspace `prepare`/`postinstall` hooks — the
  // candidate's freshly generated wrappers may not type-check against the
  // sibling classes, and we want `validate:build` to surface that as a finding
  // rather than aborting the install.
  await rm(resolve(repoRoot, 'package-lock.json'), { force: true });
  await rm(resolve(repoRoot, 'node_modules'), { recursive: true, force: true });
  await run('npm', ['install', '--ignore-scripts'], { cwd: repoRoot });

  // Confirm the swap landed by byte-comparing web-types.json.
  const all = await collectAllVaadinDeps();
  const overridable = all.filter((n) => existsSync(siblingPackageDir(n)));
  const sample = overridable.find((n) => existsSync(resolve(repoRoot, 'node_modules', n, 'web-types.json')));
  if (!sample) {
    throw new Error('After npm install, no swapped @vaadin/* package has a web-types.json — abort.');
  }
  const installed = await readFile(resolve(repoRoot, 'node_modules', sample, 'web-types.json'), 'utf8');
  const siblingCopy = await readFile(resolve(siblingPackageDir(sample), 'web-types.json'), 'utf8');
  if (installed !== siblingCopy) {
    throw new Error(
      `node_modules/${sample}/web-types.json still differs from sibling after install — aborting to avoid a misleading report.`,
    );
  }
  console.log(`✓ confirmed ${sample} now resolves from sibling`);
}

async function captureCandidate() {
  await rm(candidateDir, { recursive: true, force: true });
  await mkdir(candidateDir, { recursive: true });
  await run('npm', ['run', 'build:load-schema'], { cwd: repoRoot });
  for (const pkg of PACKAGES) {
    await run('npm', ['run', 'build:generate', '-w', `packages/${pkg.name}`], { cwd: repoRoot });
  }
  for (const pkg of PACKAGES) {
    await copyDir(resolve(repoRoot, pkg.generated), resolve(candidateDir, pkg.name));
  }
  await snapshotVaadinWebTypes(resolve(candidateDir, 'web-types'));
}

async function runValidation() {
  const sink = [];
  for (const script of ['validate:types', 'validate:build']) {
    sink.push(`\n===== npm run ${script} =====\n`);
    try {
      const out = await runCapture('npm', ['run', script], { cwd: repoRoot, mergeStderr: true });
      sink.push(out);
      sink.push(`\n[${script}] exit 0\n`);
    } catch (err) {
      sink.push(err.stdout ?? '');
      sink.push(`\n[${script}] FAILED: ${err.message}\n`);
    }
  }
  await writeFile(validateLogPath, sink.join(''));
}

async function cleanup() {
  const savedPkg = resolve(savedDir, 'package.json');
  const savedLock = resolve(savedDir, 'package-lock.json');
  if (existsSync(savedPkg)) {
    await cp(savedPkg, resolve(repoRoot, 'package.json'));
  }
  if (existsSync(savedLock)) {
    await cp(savedLock, resolve(repoRoot, 'package-lock.json'));
  }
  for (const pkg of PACKAGES) {
    const saved = resolve(savedDir, `${pkg.name}.package.json`);
    if (existsSync(saved)) {
      await cp(saved, resolve(repoRoot, pkg.pkgJson));
    }
  }
  await run('npm', ['ci'], { cwd: repoRoot });
  await run('npm', ['run', 'build:load-schema'], { cwd: repoRoot });
  for (const pkg of PACKAGES) {
    await run('npm', ['run', 'build:generate', '-w', `packages/${pkg.name}`], { cwd: repoRoot });
  }
}

// ---------------------------------------------------------------------------
// Diff & report
// ---------------------------------------------------------------------------

async function writeReport() {
  const validateResult = existsSync(validateLogPath) ? await readFile(validateLogPath, 'utf8') : null;

  const pkgDiffs = [];
  for (const pkg of PACKAGES) {
    pkgDiffs.push({ pkg, diff: await diffPackage(pkg) });
  }
  const classification = classify(pkgDiffs);
  classification.confirmedRegressions = await verifyRegressions();

  const lines = [];
  lines.push('# CEM web-types → React wrappers — comparison report');
  lines.push('');
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Baseline: npm-registry @vaadin packages (from saved \`package-lock.json\`)`);
  lines.push(`- Candidate: ${siblingDir}`);
  lines.push(`- Baseline snapshot: \`${relative(repoRoot, baselineDir)}/\``);
  lines.push(`- Candidate snapshot: \`${relative(repoRoot, candidateDir)}/\``);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('| Package | Added files | Removed files | Modified files | Candidate total |');
  lines.push('|---|---:|---:|---:|---:|');
  for (const { pkg, diff } of pkgDiffs) {
    lines.push(`| ${pkg.name} | ${diff.added.length} | ${diff.removed.length} | ${diff.modified.length} | ${diff.totalFiles} |`);
  }
  lines.push('');

  lines.push('## ⚠ Surprises (not predicted by CEM-MIGRATION.md)');
  lines.push('');
  if (classification.surprises.length === 0) {
    lines.push('_None — all deltas match the migration-doc predictions._');
  } else {
    lines.push('Each item is a diff that does not match any A/B/C category. Review these before merging PR #11539.');
    lines.push('');
    for (const s of classification.surprises) {
      lines.push(`- **${s.pkg}/${s.component}** — ${s.kind}: \`${s.event}\``);
    }
  }
  lines.push('');

  lines.push('## Category A — intended event drops (verify no consumer relied on these)');
  lines.push('');
  reportBucket(lines, classification.expectedDrops, 'dropped');

  lines.push('## Category B — new events surfaced (new React `on*` props)');
  lines.push('');
  reportBucket(lines, classification.expectedAdditions, 'added');

  lines.push('## Category C — regressions that require fixes in web-components');
  lines.push('');
  lines.push('Events predicted by CEM-MIGRATION.md that were expected but did NOT appear in the candidate output. Fix by adding `@fires` to the upstream mixin and re-run this script.');
  lines.push('');
  if (classification.confirmedRegressions.length === 0) {
    lines.push('_None — every predicted regression either was fixed upstream or no longer applies._');
  } else {
    for (const r of classification.confirmedRegressions) {
      lines.push(`- **${r.pkg}/${r.component}** missing event \`${r.event}\` → React prop \`on${camel(r.event)}\``);
    }
  }
  lines.push('');

  lines.push('## Build & type validation');
  lines.push('');
  if (validateResult === null) {
    lines.push('_Skipped (--no-validate)._');
  } else {
    const passed = !/\[validate:(types|build)\] FAILED/.test(validateResult);
    lines.push(`- Overall: ${passed ? '✅ pass' : '❌ failures — see below'}`);
    lines.push('');
    lines.push(
      '> ℹ Errors mentioning `test/` files and `Cannot find module \'lit\'` are artifacts of `npm install --ignore-scripts` (used to bypass the workspace `prepare` hook). Real blockers are `packages/*/src/generated/*.ts` errors and `dev/pages/*` errors.',
    );
    lines.push('');
    lines.push('```');
    const max = 200;
    const all = validateResult.split('\n');
    const trimmed = all.slice(0, max).join('\n');
    lines.push(trimmed);
    if (all.length > max) {
      lines.push(`... (${all.length - max} more lines in ${relative(repoRoot, validateLogPath)})`);
    }
    lines.push('```');
  }
  lines.push('');

  lines.push('## Per-component event diffs');
  lines.push('');
  for (const { pkg, diff } of pkgDiffs) {
    lines.push(`### ${pkg.name}`);
    lines.push('');
    if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
      lines.push('_No differences._');
      lines.push('');
      continue;
    }
    if (diff.added.length) {
      lines.push(`**Added files** (${diff.added.length}): ${diff.added.map((f) => '`' + f + '`').join(', ')}`);
      lines.push('');
    }
    if (diff.removed.length) {
      lines.push(`**Removed files** (${diff.removed.length}): ${diff.removed.map((f) => '`' + f + '`').join(', ')}`);
      lines.push('');
    }
    if (diff.modified.length) {
      lines.push(`**Modified files** (${diff.modified.length}):`);
      lines.push('');
      for (const m of diff.modified) {
        lines.push(`- \`${m.file}\``);
        if (m.events.added.length) lines.push(`  - events added: ${m.events.added.map((e) => '`' + e + '`').join(', ')}`);
        if (m.events.removed.length) lines.push(`  - events removed: ${m.events.removed.map((e) => '`' + e + '`').join(', ')}`);
        if (m.events.added.length === 0 && m.events.removed.length === 0) {
          lines.push('  - _no event-list changes; diff is in types/imports/ordering. See forensic diff below._');
        }
      }
      lines.push('');
    }
  }

  lines.push('## Appendix — forensic diff');
  lines.push('');
  lines.push('Raw `diff -ruN baseline candidate` (capped at ~200KB).');
  lines.push('');
  lines.push('```diff');
  lines.push((await rawDiff()).slice(0, 200_000));
  lines.push('```');

  await writeFile(reportPath, lines.join('\n'));
}

async function diffPackage({ name }) {
  const baseline = resolve(baselineDir, name);
  const candidate = resolve(candidateDir, name);
  const baseFiles = existsSync(baseline) ? (await readdir(baseline)).filter((f) => f.endsWith('.ts')) : [];
  const candFiles = existsSync(candidate) ? (await readdir(candidate)).filter((f) => f.endsWith('.ts')) : [];
  const baseSet = new Set(baseFiles);
  const candSet = new Set(candFiles);
  const added = [...candSet].filter((f) => !baseSet.has(f)).sort();
  const removed = [...baseSet].filter((f) => !candSet.has(f)).sort();
  const common = [...baseSet].filter((f) => candSet.has(f)).sort();
  const modified = [];
  for (const f of common) {
    const a = await readFile(resolve(baseline, f), 'utf8');
    const b = await readFile(resolve(candidate, f), 'utf8');
    if (a !== b) {
      modified.push({ file: f, events: diffEvents(a, b) });
    }
  }
  return { added, removed, modified, totalFiles: candFiles.length };
}

function diffEvents(baseline, candidate) {
  const eventsOf = (src) => {
    const m = src.match(/const events\s*=\s*\{([\s\S]*?)\}\s*as\s+\w+EventMap/);
    if (!m) return new Map();
    const events = new Map();
    // The generator emits every property on one line: `{ onX: "x", onY: "y" }`.
    // matchAll across the whole block instead of splitting by newline.
    for (const em of m[1].matchAll(/(\w+)\s*:\s*"([^"]+)"/g)) {
      events.set(em[2], em[1]);
    }
    return events;
  };
  const a = eventsOf(baseline);
  const b = eventsOf(candidate);
  const added = [...b.keys()].filter((e) => !a.has(e)).sort();
  const removed = [...a.keys()].filter((e) => !b.has(e)).sort();
  return { added, removed };
}

function classify(pkgDiffs) {
  const surprises = [];
  const expectedDrops = [];
  const expectedAdditions = [];

  for (const { pkg, diff } of pkgDiffs) {
    for (const m of diff.modified) {
      const component = m.file.replace(/\.ts$/, '');
      for (const ev of m.events.removed) {
        if (EXPECTED_EVENT_DROPS[component]?.includes(ev)) {
          expectedDrops.push({ pkg: pkg.name, component, event: ev });
        } else if (REGRESSION_MISSING_EVENTS[component]?.includes(ev)) {
          // Known C1 — the event was in baseline and not in candidate, matching
          // the doc's prediction. Reported under Category C, not a surprise.
        } else {
          surprises.push({ pkg: pkg.name, component, event: ev, kind: 'event REMOVED unexpectedly' });
        }
      }
      for (const ev of m.events.added) {
        if (EXPECTED_EVENT_ADDITIONS[component]?.includes(ev)) {
          expectedAdditions.push({ pkg: pkg.name, component, event: ev });
        } else {
          surprises.push({ pkg: pkg.name, component, event: ev, kind: 'event ADDED unexpectedly' });
        }
      }
    }
    for (const f of diff.added) {
      surprises.push({ pkg: pkg.name, component: f.replace(/\.ts$/, ''), event: '(new wrapper file)', kind: 'NEW component wrapper' });
    }
    for (const f of diff.removed) {
      surprises.push({ pkg: pkg.name, component: f.replace(/\.ts$/, ''), event: '(wrapper removed)', kind: 'REMOVED component wrapper' });
    }
  }

  return { surprises, expectedDrops, expectedAdditions };
}

async function verifyRegressions() {
  // A "regression" is an event that was in baseline but disappeared in candidate.
  // If neither has it (e.g. scripts/utils/settings.ts has it in `remove`), it is
  // not a diff against what the registry currently ships and shouldn't be flagged.
  const regressions = [];
  for (const [component, events] of Object.entries(REGRESSION_MISSING_EVENTS)) {
    const candidatePkg = component.startsWith('GridPro') ? 'react-components-pro' : 'react-components';
    const basePath = resolve(baselineDir, candidatePkg, `${component}.ts`);
    const candPath = resolve(candidateDir, candidatePkg, `${component}.ts`);
    if (!existsSync(basePath) || !existsSync(candPath)) continue;
    const baseSrc = await readFile(basePath, 'utf8');
    const candSrc = await readFile(candPath, 'utf8');
    for (const ev of events) {
      const needle = `"${ev}"`;
      if (baseSrc.includes(needle) && !candSrc.includes(needle)) {
        regressions.push({ pkg: candidatePkg, component, event: ev });
      }
    }
  }
  return regressions;
}

function reportBucket(lines, entries, verb) {
  if (entries.length === 0) {
    lines.push('_None._');
    lines.push('');
    return;
  }
  const byComp = new Map();
  for (const e of entries) {
    const key = `${e.pkg}/${e.component}`;
    if (!byComp.has(key)) byComp.set(key, []);
    byComp.get(key).push(e.event);
  }
  for (const [key, events] of byComp) {
    lines.push(`- **${key}** ${verb}: ${events.map((e) => '`' + e + '`').join(', ')}`);
  }
  lines.push('');
}

async function rawDiff() {
  try {
    return await runCapture('diff', ['-ruN', baselineDir, candidateDir], { allowNonZero: true });
  } catch (err) {
    return err.stdout ?? String(err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--skip-sibling-build') out['skip-sibling-build'] = true;
    else if (a === '--skip-baseline') out['skip-baseline'] = true;
    else if (a === '--report-only') out['report-only'] = true;
    else if (a === '--no-validate') out.validate = false;
    else if (a === '--no-cleanup') out.cleanup = false;
    else if (a === '--web-components-dir') out['web-components-dir'] = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function printHelp() {
  const lines = [
    'compare-cem-wrappers.mjs — diff React wrappers against sibling web-components CEM build',
    '',
    'Usage:',
    '  node scripts/compare-cem-wrappers.mjs [options]',
    '',
    'Options:',
    '  --web-components-dir <path>  Path to sibling checkout (default ../web-components)',
    '  --skip-sibling-build         Skip rebuilding CEM + web-types in the sibling',
    '  --skip-baseline              Reuse existing .cem-comparison/baseline',
    '  --report-only                Regenerate REPORT.md from existing snapshots (no install/gen)',
    '  --no-validate                Skip validate:types and validate:build',
    '  --no-cleanup                 Leave candidate state in node_modules',
    '  --help                       Show this message',
  ];
  console.log(lines.join('\n'));
}

function logStep(msg) {
  console.log(`\n── ${msg} ──`);
}

function siblingPackageDir(vaadinName) {
  const short = vaadinName.replace(/^@vaadin\//, '');
  return resolve(siblingDir, 'packages', short);
}

async function collectAllVaadinDeps() {
  const set = new Set();
  for (const pkg of PACKAGES) {
    const p = JSON.parse(await readFile(resolve(repoRoot, pkg.pkgJson), 'utf8'));
    for (const dep of Object.keys(p.dependencies ?? {})) {
      if (!dep.startsWith('@vaadin/')) continue;
      if (dep === '@vaadin/react-components' || dep === '@vaadin/react-components-pro') continue;
      set.add(dep);
    }
  }
  return [...set].sort();
}

async function snapshotVaadinWebTypes(dstDir) {
  await mkdir(dstDir, { recursive: true });
  const vaadinRoot = resolve(repoRoot, 'node_modules/@vaadin');
  if (!existsSync(vaadinRoot)) return;
  for (const dir of await readdir(vaadinRoot)) {
    const src = resolve(vaadinRoot, dir, 'web-types.json');
    if (existsSync(src)) {
      await cp(src, resolve(dstDir, `${dir}.json`));
    }
  }
}

async function copyDir(src, dst) {
  await rm(dst, { recursive: true, force: true });
  await mkdir(dst, { recursive: true });
  await cp(src, dst, { recursive: true });
}

function camel(kebab) {
  return kebab.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function run(cmd, argv, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, argv, { stdio: 'inherit', ...opts });
    p.on('error', rej);
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${cmd} ${argv.join(' ')} exited ${code}`))));
  });
}

function runCapture(cmd, argv, opts = {}) {
  return new Promise((res, rej) => {
    const { allowNonZero, mergeStderr, ...rest } = opts;
    const p = spawn(cmd, argv, { stdio: ['ignore', 'pipe', mergeStderr ? 'pipe' : 'inherit'], ...rest });
    let out = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    if (mergeStderr && p.stderr) p.stderr.on('data', (d) => (out += d.toString()));
    p.on('error', rej);
    p.on('close', (code) => {
      if (code === 0 || allowNonZero) res(out);
      else {
        const err = new Error(`${cmd} ${argv.join(' ')} exited ${code}`);
        err.stdout = out;
        rej(err);
      }
    });
  });
}

// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error('\n✖', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

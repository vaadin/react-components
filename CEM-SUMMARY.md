# CEM web-types → React wrappers — summary of required fixes

Findings from running `scripts/compare-cem-wrappers.mjs` against `vaadin/web-components`
branch `chore/cem-web-types` (PR #11539, HEAD `30a5ff787b`). Cross-referenced
with categories A/B/C from `../web-components/CEM-MIGRATION.md`.

## How to reproduce

```bash
# From vaadin/react-components repo root:
node scripts/compare-cem-wrappers.mjs --skip-sibling-build
```

The script captures a baseline from the registry-installed `@vaadin/*` packages,
rewrites workspace `package.json` `dependencies` to `file:../web-components/packages/*`,
regenerates wrappers, runs `validate:types` + `validate:build`, diffs, and writes
`.cem-comparison/REPORT.md`. Cleans up on exit (restores `package.json` + `package-lock.json`
and re-runs `npm ci`). Use `--report-only` for fast re-classification once snapshots exist.

Flags: `--web-components-dir <path>`, `--skip-sibling-build`, `--skip-baseline`,
`--report-only`, `--no-validate`, `--no-cleanup`.

## Blockers for PR #11539 — fix in `vaadin/web-components`

### 1. Grid-Pro missing `@fires` annotations (C1 — confirmed)

Without these, `<GridPro>` and `<GridProEditColumn>` lose three React event
props that exist in the current release:

| Element | Missing event | Missing React prop |
|---|---|---|
| `vaadin-grid-pro` | `enter-next-row-changed` | `onEnterNextRowChanged` |
| `vaadin-grid-pro` | `single-cell-edit-changed` | `onSingleCellEditChanged` |
| `vaadin-grid-pro-edit-column` | `editor-type-changed` | `onEditorTypeChanged` |

Fix: add `@fires` annotations in
- `packages/grid-pro/src/vaadin-grid-pro-inline-editing-mixin.js`
- `packages/grid-pro/src/vaadin-grid-pro-edit-column-mixin.js`

### 2. Dashboard EventMap types not exported

Candidate-generated wrappers fail `tsc --noEmit` because the imported EventMap
types aren't exported from their modules. These are `TS2305` / `TS2724` errors:

| Generated wrapper | Import that fails | Fix location |
|---|---|---|
| `DashboardLayout.ts` | `DashboardLayoutEventMap` from `@vaadin/dashboard/vaadin-dashboard-layout.js` | `packages/dashboard/src/vaadin-dashboard-layout.*` |
| `DashboardSection.ts` | `DashboardSectionEventMap` from `@vaadin/dashboard/vaadin-dashboard-section.js` | `packages/dashboard/src/vaadin-dashboard-section.*` |
| `DashboardWidget.ts` | `DashboardWidgetEventMap` from `@vaadin/dashboard/vaadin-dashboard-widget.js` | `packages/dashboard/src/vaadin-dashboard-widget.*` |

Fix: declare + `export` an `*EventMap` type for each of these three elements in
the web-components source, matching the events that CEM now surfaces via `@fires`.

### 3. TS `*EventMap` types missing events that CEM surfaces via `@fires`

Generated wrappers reference keys that the TS EventMap type doesn't declare
(`TS2339`):

| Generated wrapper | Event key not in EventMap | TS type that needs the key |
|---|---|---|
| `Dashboard.ts` | `dashboard-root-heading-level-changed` | `DashboardCustomEventMap<T1>` |
| `DateTimePicker.ts` | `unparsable-change` | `DateTimePickerEventMap` |

Fix: add these event keys to the respective TS EventMap types so the `@fires`
annotations have matching type declarations. (Similar additions likely needed
for `DashboardLayoutEventMap` / `DashboardSectionEventMap` / `DashboardWidgetEventMap`
once those are exported — see item 2.)

### 4. New `<Overlay>` wrapper — not predicted by `CEM-MIGRATION.md`

CEM now includes `@vaadin/overlay` in web-types (Polymer Analyzer filtered it).
Candidate emits `packages/react-components/src/generated/Overlay.ts` exposing:

- `onOpenedChanged`
- `onVaadinOverlayClose`, `onVaadinOverlayClosed`, `onVaadinOverlayClosing`
- `onVaadinOverlayEscapePress`, `onVaadinOverlayOpen`, `onVaadinOverlayOutsideClick`

Decision needed: is `<Overlay>` intended to be part of the public React surface?
If not, exclude `@vaadin/overlay` in `scripts/buildWebtypes.js` (the package
blacklist) upstream. If yes, document and add a dev page + tests here.

## Blocker for PR #11539 — fix in `vaadin/react-components`

### 5. Dev page uses dropped `onInput` prop (A5 consequence)

- `dev/pages/DatePicker.tsx:67` — replace the `onInput` handler with `onChange`
  or `onValueChanged`. After CEM drops `vaadin-date-picker.input` (A5, intended),
  the React prop no longer exists and the dev page fails `tsc --noEmit`.

## Confirmed expected changes (no action needed)

Matches the A and B sections of `CEM-MIGRATION.md` exactly.

**Category A (intended event drops)** — 5 entries:
- `<ComboBox>`, `<MultiSelectComboBox>`, `<DatePicker>`, `<TimePicker>` lose `onInput` (A5)
- `<CrudEdit>` loses `onEdit` (A4)
- A3 / A6 drops were already filtered in baseline (no diff to verify).

**Category B (new `on*` React props)** — 14 entries, matching the B1 table:
- `<ContextMenu>`: `onCloseAllMenus`, `onItemsOutsideClick`
- `<Dashboard>`, `<DashboardLayout>`: `onDashboardRootHeadingLevelChanged`
- `<DashboardSection>`, `<DashboardWidget>`: `onItemMoveModeChanged`, `onItemResizeModeChanged`, `onItemSelectedChanged`
- `<DatePicker>`, `<DateTimePicker>`, `<TimePicker>`, `<IntegerField>`, `<NumberField>`: `onUnparsableChange`
- `<GridFilter>`: `onFilterChanged`
- `<GridSorter>`: `onSorterChanged`
- `<Upload>`: `onFileRemove`
- `<RichTextEditor>`: `onChange`

Verify each maps to a real DOM event on the underlying element and that no
existing consumer code in this repo was relying on the dropped events (Category A).

## Validation results summary

| Check | Result |
|---|---|
| `npm run validate:build` | ✅ pass |
| `npm run validate:types` | ❌ 6 real errors (5 generated wrappers + 1 dev page) |

`test/MasterDetailLayout.spec.tsx` and `test/typings/api.ts` errors mentioning
`Cannot find module 'lit'` are artifacts of `npm install --ignore-scripts`
(used to bypass the workspace `prepare` hook during candidate install). They
do not reflect real CEM regressions.

## Pre-merge checklist

Fix these in order — then re-run `node scripts/compare-cem-wrappers.mjs --skip-sibling-build`
and expect a clean report with zero surprises and zero `validate:types` errors
(apart from the noted `lit`-module artifacts).

- [ ] Grid-Pro: `@fires` annotations (3 events) — web-components
- [ ] Dashboard package: export `DashboardLayoutEventMap`, `DashboardSectionEventMap`, `DashboardWidgetEventMap` — web-components
- [ ] Dashboard: add `dashboard-root-heading-level-changed` to `DashboardCustomEventMap` — web-components
- [ ] DateTimePicker: add `unparsable-change` to `DateTimePickerEventMap` — web-components
- [ ] Decide on `<Overlay>` public API; filter out upstream OR add dev page + tests — either repo
- [ ] `dev/pages/DatePicker.tsx:67`: replace `onInput` with `onChange`/`onValueChanged` — react-components

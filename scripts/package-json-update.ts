import './polyfills.js';
import { globIterate as glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import type { PackageJson } from 'type-fest';
import { packageDir, srcDir } from './utils/config.js';

const packageJsonPath = resolve(packageDir, 'package.json');
const packageJson: PackageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, PackageJson.Exports> = {
  '.': {
    types: './index.d.ts',
    default: './index.js',
  },
  './package.json': './package.json',
};

type PlainExportsEntry = readonly [entrypoint: string, path: string];
type ConditionalExportsEntry = readonly [entrypoint: string, exportConditions: Partial<PackageJson.ExportConditions>];
type ExportsEntry = PlainExportsEntry | ConditionalExportsEntry;

const collator = new Intl.Collator('en', { sensitivity: 'base' });
function compareExportsPaths([entrypointA]: ExportsEntry, [entrypointB]: ExportsEntry) {
  return collator.compare(entrypointA, entrypointB);
}

const moduleNames = await Array.fromAsync(glob('*', { cwd: srcDir, nodir: true }), async (path) =>
  basename(path, extname(path)),
);

Object.assign(
  exports,
  Object.fromEntries(
    moduleNames
      .map(
        (moduleName) =>
          [`./${moduleName}.js`, { types: `./${moduleName}.d.ts`, default: `./${moduleName}.js` }] as const,
      )
      .sort(compareExportsPaths),
  ),
);

// Add extensionless compatibility export aliases. NOTE: the order
// is important, the earlier entries with .js have higher priority
// and are preferred over the ones without the extension.
Object.assign(
  exports,
  Object.fromEntries(
    moduleNames.map((moduleName) => [`./${moduleName}`, `./${moduleName}.js`] as const).sort(compareExportsPaths),
  ),
);

// Add css file entries

const outCssDir = resolve(packageDir, 'css');
if (existsSync(outCssDir)) {
  Object.assign(
    exports,
    Object.fromEntries(
      (
        await Array.fromAsync(
          glob('**/*', { cwd: outCssDir, posix: true, nodir: true }),
          async (path) => [`./css/${path}`, `./css/${path}`] as const,
        )
      ).sort(compareExportsPaths),
    ),
  );
}

// Add utils entries
const outUtilsDir = resolve(packageDir, 'utils');
if (existsSync(outUtilsDir)) {
  Object.assign(
    exports,
    Object.fromEntries(
      (
        await Array.fromAsync(
          glob('**/*', { cwd: outUtilsDir, posix: true, nodir: true }),
          async (path) => [`./utils/${path}`, `./utils/${path}`] as const,
        )
      ).sort(compareExportsPaths),
    ),
  );
}

// Add renderers entries
const outRenderersDir = resolve(packageDir, 'renderers');
if (existsSync(outRenderersDir)) {
  Object.assign(
    exports,
    Object.fromEntries(
      (
        await Array.fromAsync(
          glob('**/*', { cwd: outRenderersDir, posix: true, nodir: true }),
          async (path) => [`./renderers/${path}`, `./renderers/${path}`] as const,
        )
      ).sort(compareExportsPaths),
    ),
  );
}

packageJson.exports = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

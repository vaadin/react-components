import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, relative, resolve, sep } from 'node:path';
import type { PackageJson } from 'type-fest';
import { rootDir, srcDir } from './utils/config.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';

const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, PackageJson.Exports> = {
  './package.json': './package.json',
};

type ExportsRecord = readonly [exportsPath: string, exportsObject: Partial<PackageJson.ExportConditions>];

const collator = new Intl.Collator('en', { sensitivity: 'base' });
function compareExportsPaths([pathA]: ExportsRecord, [pathB]: ExportsRecord) {
  return collator.compare(pathA, pathB);
}

Object.assign(
  exports,
  Object.fromEntries(
    (
      await fromAsync(fswalk(srcDir), async ([path]) => {
        const moduleName = basename(path, extname(path));

        return [
          `./${moduleName}.js`,
          { types: `./${moduleName}.d.ts`, default: `./${moduleName}.js` },
        ] as ExportsRecord;
      })
    ).sort(compareExportsPaths),
  ),
);

// Add css file entries
const outCssDir = resolve(rootDir, 'css');
Object.assign(
  exports,
  Object.fromEntries(
    (
      await fromAsync(fswalk(outCssDir, { recursive: true }), async ([path]) => {
        const cssPath = relative(outCssDir, path).replaceAll(sep, '/');

        return [`./css/${cssPath}`, { default: `./css/${cssPath}` }] as ExportsRecord;
      })
    ).sort(compareExportsPaths),
  ),
);

packageJson['exports'] = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

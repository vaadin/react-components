import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { rootDir } from './config.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { ElementNameMissingError } from './errors.js';
import { camelCase, stripPrefix } from './utils.js';

const descriptions = await loadDescriptions();
const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

const exports: Record<string, Record<string, string>> = {
  './index.js': {
    default: './index.js',
  },
};

for (const [packageName, element] of extractElementsFromDescriptions(descriptions)) {
  if (!element.name) {
    throw new ElementNameMissingError(packageName);
  }

  const moduleName = stripPrefix(camelCase(element.name));
  const modulePath = `./${moduleName}.js`;

  exports[modulePath] = {
    default: modulePath,
  };
}

packageJson['exports'] = exports;

await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

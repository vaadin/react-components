import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PackageJson } from 'type-fest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

console.log('Updating Vaadin web components versions in "package.json"...');

const workspacePackageJsonPath = resolve(rootDir, 'package.json');
const workspacePackageJson = JSON.parse(await readFile(workspacePackageJsonPath, 'utf8')) as PackageJson;
// Web components version should be the same as the version of the react-components package:
const componentsVersion = workspacePackageJson.version;
console.log(`Using "${componentsVersion}" as the version for web components.`);

const packagesDir = resolve(rootDir, 'packages');
const packages = await readdir(packagesDir);

for (const packageName of packages) {
  const packageJsonPath = resolve(packagesDir, packageName, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;

  Object.keys(packageJson.dependencies!).forEach((name) => {
    if (!name.startsWith('@vaadin/')) {
      return;
    }

    packageJson.version = componentsVersion;
    packageJson.dependencies![name] = componentsVersion;
  });

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
}

// Update version metadata in the sources

const versionSourceFile = 'packages/react-components/src/utils/createComponent.ts';
console.log(`Updating version metadata in "${versionSourceFile}"...`);
const versionSourcePath = resolve(rootDir, versionSourceFile);
const versionSource = await readFile(versionSourcePath, 'utf8');
const newVersionSource = versionSource.replace(
  /version:.+,/g,
  `version: /* updated-by-script */ '${componentsVersion}',`,
);

await writeFile(versionSourcePath, newVersionSource, 'utf8');

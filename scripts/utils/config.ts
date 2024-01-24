import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = process.env.PACKAGE;
if (!pkg) {
  throw new Error('PACKAGE environment variable is not set');
}

export const isPro = pkg.endsWith('-pro');
const __dirname = dirname(fileURLToPath(import.meta.url));
export const rootDir = resolve(__dirname, '../..');
const packagesDir = resolve(rootDir, 'packages');
export const packageDir = resolve(packagesDir, pkg);
export const srcDir = resolve(packageDir, 'src');
export const generatedDir = resolve(srcDir, 'generated');
export const utilsDir = resolve(srcDir, 'utils');
export const nodeModulesDir = resolve(rootDir, 'node_modules');
export const typesDir = resolve(rootDir, 'types');

export const rootURL = new URL('../../', import.meta.url);
export const packageURL = new URL(`packages/${pkg}/`, rootURL);
export const srcURL = new URL('src/', packageURL);
export const generatedURL = new URL('generated/', srcURL);

await Promise.all([mkdir(generatedDir, { recursive: true }), mkdir(typesDir, { recursive: true })]);

export const stylePackages = ['@vaadin/vaadin-lumo-styles', '@vaadin/vaadin-material-styles'];

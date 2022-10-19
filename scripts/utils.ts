import type { Dirent } from 'fs';
import { access, constants, opendir } from 'node:fs/promises';
import { join } from 'node:path';
import ts, { type SourceFile, type Statement } from 'typescript';

export function camelCase(str: string) {
  // CamelCase join
  return str
    .split('-')
    .map((part) => part[0].toUpperCase() + part.substring(1))
    .join('');
}

const prefixPattern = /vaadin/gi;

export function stripPrefix(str: string) {
  return str.replaceAll(prefixPattern, '');
}

export function createSourceFile(statements: readonly Statement[], fileName: string): SourceFile {
  const sourceFile = ts.createSourceFile(fileName, '', ts.ScriptTarget.ES2019, undefined, ts.ScriptKind.TS);
  return ts.factory.updateSourceFile(sourceFile, statements);
}

export async function exists(file: string): Promise<boolean> {
  try {
    await access(file, constants.R_OK);
    return true;
  } catch (_) {
    return false;
  }
}

async function* walk(dir: string): AsyncGenerator<string, void> {
  const dirs: Dirent[] = [];

  for await (const d of await opendir(dir)) {
    if (d.isDirectory()) {
      dirs.push(d);
    } else if (d.isFile()) {
      yield join(dir, d.name);
    }
  }

  for (const d of dirs) {
    yield* walk(join(dir, d.name));
  }
}

export async function search(name: string, dir: string): Promise<string | undefined> {
  for await (const file of walk(dir)) {
    if (file.endsWith(`${name}.js`)) {
      return file;
    }
  }
}

export function hasOverrideKey([overrideKey]: readonly string[]) {
  return overrideKey === '--override';
}

export function createImportPath(link: string, local: boolean) {
  let updatedLink = link;

  if (!updatedLink.startsWith('.') && local) {
    updatedLink = `./${updatedLink}`;
  }

  return updatedLink.replace('.ts', '.js').replaceAll('\\', '/');
}

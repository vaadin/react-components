import { unlink, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import ts from 'typescript';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, srcDir } from './utils/config.js';
import { ElementNameMissingError, warnAboutExistingFile } from './utils/errors.js';
import filterEmptyItems from './utils/filterEmptyItems.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import {
  camelCase,
  createImportPath,
  createSourceFile,
  exists,
  hasOverrideKey,
  search,
  stripPrefix,
} from './utils/misc.js';

const shouldOverride = hasOverrideKey(process.argv.slice(2));

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
});

if (shouldOverride) {
  await fromAsync(fswalk(srcDir), ([path]) => unlink(path));
}

const stubPaths: readonly string[] = filterEmptyItems(
  await Promise.all(
    Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
      if (!element.name) {
        throw new ElementNameMissingError(packageName);
      }

      if (!(await search(element.name, resolve(nodeModulesDir, packageName)))) {
        return;
      }

      const moduleName = stripPrefix(camelCase(element.name));
      const modulePath = resolve(srcDir, `${moduleName}.ts`);
      const moduleTsxPath = resolve(srcDir, `${moduleName}.tsx`);

      const existingModulePath = (await exists(moduleTsxPath))
        ? moduleTsxPath
        : (await exists(modulePath))
        ? modulePath
        : undefined;

      if (!existingModulePath || shouldOverride) {
        const exportExpression = ts.factory.createExportDeclaration(
          undefined,
          false,
          undefined,
          ts.factory.createStringLiteral(
            createImportPath(relative(srcDir, resolve(generatedDir, `${moduleName}.js`)), true),
          ),
        );

        const sourceFile = createSourceFile([exportExpression], modulePath);
        const contents = printer.printFile(sourceFile);
        await writeFile(modulePath, contents, 'utf8');
      } else {
        warnAboutExistingFile(existingModulePath);
      }

      return modulePath;
    }),
  ),
);

const statements = stubPaths.map((path) =>
  ts.factory.createExportDeclaration(
    undefined,
    false,
    undefined,
    ts.factory.createStringLiteral(createImportPath(relative(srcDir, path), true)),
  ),
);

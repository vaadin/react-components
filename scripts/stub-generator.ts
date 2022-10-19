import { writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import ts from 'typescript';
import { generatedDir, srcDir } from './config.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { ElementNameMissingError, warnAboutExistingFile } from './errors.js';
import { camelCase, createImportPath, createSourceFile, exists, hasOverrideKey, stripPrefix } from './utils.js';

const shouldOverride = hasOverrideKey(process.argv.slice(2));

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({});

const stubPaths = await Promise.all(
  Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
    if (!element.name) {
      throw new ElementNameMissingError(packageName);
    }

    const moduleName = stripPrefix(camelCase(element.name));
    const modulePath = resolve(srcDir, `${moduleName}.ts`);

    if (!(await exists(modulePath)) || shouldOverride) {
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
      warnAboutExistingFile(modulePath);
    }

    return modulePath;
  }),
);

const statements = stubPaths.map((path) =>
  ts.factory.createExportDeclaration(
    undefined,
    false,
    undefined,
    ts.factory.createStringLiteral(createImportPath(relative(srcDir, path), true)),
  ),
);

const indexPath = resolve(srcDir, 'index.ts');

if (!(await exists(indexPath)) || shouldOverride) {
  const sourceFile = createSourceFile(statements, indexPath);
  const contents = printer.printFile(sourceFile);
  await writeFile(indexPath, contents, 'utf8');
}

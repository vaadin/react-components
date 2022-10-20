import { unlink, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import ts, { type Identifier, type ImportDeclaration, SourceFile } from 'typescript';
import type { HtmlElement as SchemaHTMLElement, JSONSchemaForWebTypes } from '../types/schema.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, utilsDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import { camelCase, createImportPath, createSourceFile, filterEmptyItems, search, stripPrefix } from './utils/misc.js';

type ImportWithDeclaration<T> = readonly [id: T, declaration: ImportDeclaration];
type ElementData = Readonly<{
  packageName: string;
  path: string;
}>;

await fromAsync(fswalk(generatedDir), ([path]) => unlink(path));

async function prepareElementFiles(
  descriptions: readonly JSONSchemaForWebTypes[],
): Promise<Map<SchemaHTMLElement, ElementData>> {
  const elementFilesMap = new Map<SchemaHTMLElement, ElementData>();

  await Promise.all(
    Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
      if (!element.name) {
        throw new ElementNameMissingError(packageName);
      }

      const path = await search(element.name, resolve(nodeModulesDir, packageName));

      if (path) {
        elementFilesMap.set(element, {
          packageName,
          path,
        });
      }
    }),
  );

  return elementFilesMap;
}

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({});

function createReactImport(): ImportWithDeclaration<Identifier> {
  const reactId = ts.factory.createIdentifier('React');
  return [
    reactId,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(false, reactId, undefined),
      ts.factory.createStringLiteral('react'),
    ),
  ];
}

function createLitLabsReactImport(): ImportWithDeclaration<Identifier> {
  const eventNameTypeId = ts.factory.createIdentifier('EventName');
  return [
    eventNameTypeId,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports([ts.factory.createImportSpecifier(false, undefined, eventNameTypeId)]),
      ),
      ts.factory.createStringLiteral('@lit-labs/react'),
    ),
  ];
}

function createInternalCreateComponentImport(): ImportWithDeclaration<Identifier> {
  const createComponentId = ts.factory.createIdentifier('createComponent');
  const importPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);
  return [
    createComponentId,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([ts.factory.createImportSpecifier(false, undefined, createComponentId)]),
      ),
      ts.factory.createStringLiteral(importPath),
    ),
  ];
}

function createElementModuleImport(className: string, moduleSpecifier: string): ImportWithDeclaration<Identifier> {
  const elementModuleId = ts.factory.createIdentifier(`${className}Module`);
  return [
    elementModuleId,
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(false, undefined, ts.factory.createNamespaceImport(elementModuleId)),
      ts.factory.createStringLiteral(moduleSpecifier),
    ),
  ];
}

function generateReactComponent({ name, js }: SchemaHTMLElement, { packageName, path }: ElementData): SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const hasEvents = !!js?.events && js.events.length > 0;
  const importPath = createImportPath(relative(nodeModulesDir, path), false);

  const className = stripPrefix(camelCase(name));
  const [reactId, reactImport] = createReactImport();
  const [eventNameTypeId, litReactLabsImport] = createLitLabsReactImport();
  const [createComponentId, internalCreateComponentImport] = createInternalCreateComponentImport();
  const [elementModuleId, elementModuleImport] = createElementModuleImport(className, importPath);

  const componentId = ts.factory.createIdentifier(className);
  const elementId = ts.factory.createPropertyAccessExpression(elementModuleId, className);

  const createComponentCall = ts.factory.createCallExpression(createComponentId, undefined, [
    reactId,
    ts.factory.createStringLiteral(name),
    elementId,
    ...(hasEvents
      ? [
          ts.factory.createObjectLiteralExpression(
            js!.events!.map(({ name: eventName }) => {
              if (!eventName) {
                throw new Error(`[${packageName}/${name}]: event name is missing`);
              }

              return ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier(`on${camelCase(eventName)}`),
                ts.factory.createAsExpression(
                  ts.factory.createStringLiteral(eventName),
                  ts.factory.createTypeReferenceNode(eventNameTypeId!, [
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('CustomEvent'), [
                      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                    ]),
                  ]),
                ),
              );
            }),
          ),
        ]
      : []),
  ]);

  const componentExport = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [ts.factory.createVariableDeclaration(componentId, undefined, undefined, createComponentCall)],
      ts.NodeFlags.Const,
    ),
  );

  const elementNamespaceExport = ts.factory.createExportDeclaration(
    undefined,
    false,
    ts.factory.createNamedExports([ts.factory.createExportSpecifier(false, undefined, elementModuleId)]),
  );

  const statements = filterEmptyItems([
    reactImport,
    ...(hasEvents ? [litReactLabsImport] : []),
    elementModuleImport,
    internalCreateComponentImport,
    componentExport,
    elementNamespaceExport,
  ]);

  return createSourceFile(statements, resolve(generatedDir, `${className}.ts`));
}

function generateIndexFile(files: readonly SourceFile[]): SourceFile {
  const statements = files.map(({ fileName }) =>
    ts.factory.createExportDeclaration(
      undefined,
      false,
      undefined,
      ts.factory.createStringLiteral(createImportPath(relative(generatedDir, fileName), true), true),
    ),
  );

  return createSourceFile(statements, resolve(generatedDir, 'index.ts'));
}

const elementFilesMap = await prepareElementFiles(descriptions);

const sourceFiles = Array.from(elementFilesMap.entries(), ([element, data]) => generateReactComponent(element, data));

const indexFile = generateIndexFile(sourceFiles);

async function printAndWrite(file: SourceFile) {
  const contents = printer.printFile(file);
  await writeFile(file.fileName, contents, 'utf8');
}

await Promise.all([...sourceFiles.map(printAndWrite), printAndWrite(indexFile)]);

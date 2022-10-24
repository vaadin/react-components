import { unlink, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import ts, {
  type Node,
  type SourceFile,
  type TypeAliasDeclaration,
  type VariableDeclaration,
  type VariableStatement,
} from 'typescript';
import type {
  GenericJsContribution,
  HtmlElement as SchemaHTMLElement,
  JSONSchemaForWebTypes,
} from '../types/schema.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, utilsDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import { elementsWithEventIssues, genericElements } from './utils/issues.js';
import {
  camelCase,
  createImportPath,
  createSourceFile,
  search,
  stripPrefix,
  template,
  transform,
} from './utils/misc.js';

// Placeholders
const CALL_EXPRESSION = '$CALL_EXPRESSION$';
const COMPONENT_NAME = '$COMPONENT_NAME$';
const COMPONENT_PROPS = '$COMPONENT_PROPS$';
const COMPONENT_TAG = '$COMPONENT_TAG$';
const CREATE_COMPONENT_PATH = '$CREATE_COMPONENT_PATH$';
const EVENT_MAP = '$EVENT_MAP$';
const EVENT_MAP_DECLARATION = '$EVENT_MAP_DECLARATION$';
const EVENT_MAP_REF = '$EVENT_MAP_REF$';
const EVENTS_DECLARATION = '$EVENTS_DECLARATION$';
const LIT_REACT_PATH = '$LIT_REACT_PATH$';
const MODULE = '$MODULE$';
const MODULE_PATH = '$MODULE_PATH$';
const REACT_PATH = '$REACT_PATH$';
const TYPE_ARGS = '$TYPE_ARGS$';

type EventNameMissingErrorConstructor = {
  new (): Error;
};

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

function createTypeArguments(numberOfGenerics: number) {
  return Array.from({ length: numberOfGenerics }, (_, i) => ts.factory.createIdentifier(`T${i + 1}`));
}

function createEventMapDeclaration(
  originalNode: TypeAliasDeclaration,
  elementName: string,
  numberOfGenerics: number | undefined,
  events: GenericJsContribution[] | undefined,
  EventNameMissingError: EventNameMissingErrorConstructor,
): Node {
  const eventIssues = elementsWithEventIssues.get(elementName);
  const typeArguments = numberOfGenerics ? createTypeArguments(numberOfGenerics) : undefined;
  const eventNameTypeId = ts.factory.createIdentifier('EventName');
  const elementModuleId = ts.factory.createIdentifier(MODULE);
  const eventMapId = ts.factory.createIdentifier(EVENT_MAP);

  return ts.factory.createTypeAliasDeclaration(
    originalNode.modifiers,
    eventMapId,
    typeArguments
      ? typeArguments.map((typeArgumentId) =>
          ts.factory.createTypeParameterDeclaration(undefined, typeArgumentId, undefined, undefined),
        )
      : undefined,
    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Readonly'), [
      ts.factory.createTypeLiteralNode(
        events?.map(({ name: eventName }) => {
          if (!eventName) {
            throw new EventNameMissingError();
          }

          return ts.factory.createPropertySignature(
            undefined,
            ts.factory.createIdentifier(`on${camelCase(eventName)}`),
            undefined,
            ts.factory.createTypeReferenceNode(
              eventNameTypeId,
              eventIssues?.all || eventIssues?.some?.includes(eventName)
                ? [
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('CustomEvent'), [
                      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                    ]),
                  ]
                : [
                    ts.factory.createIndexedAccessTypeNode(
                      ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(elementModuleId, `${elementName}EventMap`),
                        typeArguments ? typeArguments.map((id) => ts.factory.createTypeReferenceNode(id)) : undefined,
                      ),
                      ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(eventName)),
                    ),
                  ],
            ),
          );
        }),
      ),
    ]),
  );
}

function createEventList(
  elementName: string,
  events: GenericJsContribution[] | undefined,
  EventNameMissingError: EventNameMissingErrorConstructor,
): Node {
  return ts.factory.createObjectLiteralExpression(
    events?.map(({ name: eventName }) => {
      if (!eventName) {
        throw new EventNameMissingError();
      }

      const eventString = ts.factory.createStringLiteral(eventName);

      return ts.factory.createPropertyAssignment(ts.factory.createIdentifier(`on${camelCase(eventName)}`), eventString);
    }),
  );
}

function castEventListToEventMap(numberOfGenerics: number | undefined): Node {
  const eventMapId = ts.factory.createIdentifier(EVENT_MAP);

  return ts.factory.createTypeReferenceNode(
    eventMapId,
    numberOfGenerics
      ? Array.from({ length: numberOfGenerics }, () => ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword))
      : undefined,
  );
}

function createComponentProps(originalNode: TypeAliasDeclaration, numberOfGenerics: number | undefined): Node {
  const typeArguments = numberOfGenerics ? createTypeArguments(numberOfGenerics) : undefined;

  let result = ts.factory.createTypeAliasDeclaration(
    originalNode.modifiers,
    originalNode.name,
    typeArguments
      ? typeArguments.map((id) => ts.factory.createTypeParameterDeclaration(undefined, id, undefined, undefined))
      : undefined,
    originalNode.type,
  );

  if (numberOfGenerics) {
    result = ts.transform(result, [
      transform((node) =>
        ts.isTypeReferenceNode(node) &&
        (ts.isQualifiedName(node.typeName) || (ts.isIdentifier(node.typeName) && node.typeName.text === EVENT_MAP))
          ? ts.factory.createTypeReferenceNode(
              node.typeName,
              typeArguments
                ? typeArguments.map((typeArgumentId) => ts.factory.createTypeReferenceNode(typeArgumentId, undefined))
                : undefined,
            )
          : node,
      ),
    ]).transformed[0];
  }

  return result;
}

function maybeCastToGenericForwardedRefComponent(
  originalNode: VariableDeclaration,
  numberOfGenerics: number | undefined,
): Node {
  let initializer = originalNode.initializer;

  if (numberOfGenerics) {
    const typeArguments = createTypeArguments(numberOfGenerics);

    initializer = template(
      `
const c = ${CALL_EXPRESSION} as <${TYPE_ARGS}>(
  props: ${COMPONENT_PROPS}<${TYPE_ARGS}> & { ref?: React.ForwardedRef<${MODULE}.${COMPONENT_NAME}<${TYPE_ARGS}>> },
) => React.ReactElement | null
  `,
      (statements) => (statements[0] as VariableStatement).declarationList.declarations[0].initializer!,
      [
        transform((node) =>
          ts.isTypeReferenceNode(node) &&
          !!node.typeArguments &&
          ts.isTypeReferenceNode(node.typeArguments[0]) &&
          ts.isIdentifier(node.typeArguments[0].typeName) &&
          node.typeArguments[0].typeName.text === TYPE_ARGS
            ? ts.factory.createTypeReferenceNode(
                node.typeName,
                typeArguments.map((id) => ts.factory.createTypeReferenceNode(id)),
              )
            : node,
        ),
        transform((node) =>
          ts.isFunctionTypeNode(node)
            ? ts.factory.createFunctionTypeNode(
                typeArguments.map((id) => ts.factory.createTypeParameterDeclaration(undefined, id)),
                node.parameters,
                node.type,
              )
            : node,
        ),
        transform((node) => (ts.isIdentifier(node) && node.text === CALL_EXPRESSION ? initializer : node)),
      ],
    );
  }

  return ts.factory.createVariableDeclaration(originalNode.name, undefined, undefined, initializer);
}

function removeAllEventRelated(node: Node, hasEvents: boolean): Node | undefined {
  if (hasEvents) {
    return node;
  }

  if (
    ts.isImportDeclaration(node) &&
    ts.isStringLiteral(node.moduleSpecifier) &&
    node.moduleSpecifier.text === LIT_REACT_PATH
  ) {
    return undefined;
  }

  return node;
}

function generateReactComponent({ name, js }: SchemaHTMLElement, { packageName, path }: ElementData): SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const hasEvents = !!js?.events && js.events.length > 0;
  const events = js?.events;

  const elementName = stripPrefix(camelCase(name));
  const elementId = ts.factory.createIdentifier(elementName);
  const elementModuleId = ts.factory.createIdentifier(`${elementName}Module`);
  const elementModulePath = createImportPath(relative(nodeModulesDir, path), false);
  const eventMapId = ts.factory.createIdentifier(`${elementName}EventMap`);
  const componentPropsId = ts.factory.createIdentifier(`${elementName}Props`);
  const componentTagLiteral = ts.factory.createStringLiteral(name);
  const numberOfGenerics = genericElements.get(elementName);
  const createComponentPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);

  class EventNameMissingError extends Error {
    constructor() {
      super(`[${packageName}]: event name is missing`);
    }
  }

  const ast = template(
    `
import type { EventName } from "${LIT_REACT_PATH}";
import * as ${MODULE} from "${MODULE_PATH}";
import React from "${REACT_PATH}";
import { createComponent, type WebComponentProps } from "${CREATE_COMPONENT_PATH}";
export type ${EVENT_MAP} = Readonly<${EVENT_MAP_DECLARATION}>;
const events = ${EVENTS_DECLARATION} as ${EVENT_MAP_REF};
export type ${COMPONENT_PROPS} = WebComponentProps<${MODULE}.${COMPONENT_NAME}, ${EVENT_MAP_REF}>;
export const ${COMPONENT_NAME} = createComponent(React, ${COMPONENT_TAG}, ${MODULE}.${COMPONENT_NAME}, events);
export { ${MODULE} };
`,
    (statements) => statements,
    [
      transform((node) => removeAllEventRelated(node, hasEvents)),
      transform((node) =>
        ts.isTypeAliasDeclaration(node) && node.name.text === EVENT_MAP
          ? createEventMapDeclaration(node, elementName, numberOfGenerics, events, EventNameMissingError)
          : node,
      ),
      transform((node) =>
        ts.isIdentifier(node) && node.text === EVENTS_DECLARATION
          ? createEventList(elementName, events, EventNameMissingError)
          : node,
      ),
      transform((node) =>
        ts.isIdentifier(node) && node.text === EVENT_MAP_REF ? castEventListToEventMap(numberOfGenerics) : node,
      ),
      transform((node) =>
        ts.isTypeAliasDeclaration(node) && node.name.text === COMPONENT_PROPS
          ? createComponentProps(node, numberOfGenerics)
          : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === CREATE_COMPONENT_PATH
          ? ts.factory.createStringLiteral(createComponentPath)
          : node,
      ),
      transform((node) =>
        ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === COMPONENT_NAME
          ? maybeCastToGenericForwardedRefComponent(node, numberOfGenerics)
          : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === MODULE_PATH
          ? ts.factory.createStringLiteral(elementModulePath)
          : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === LIT_REACT_PATH
          ? ts.factory.createStringLiteral('@lit-labs/react')
          : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === REACT_PATH ? ts.factory.createStringLiteral('react') : node,
      ),
      transform((node) => (ts.isIdentifier(node) && node.text === COMPONENT_TAG ? componentTagLiteral : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === MODULE ? elementModuleId : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === EVENT_MAP ? eventMapId : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === COMPONENT_PROPS ? componentPropsId : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === COMPONENT_NAME ? elementId : node)),
    ],
  );

  return createSourceFile(ast, resolve(generatedDir, `${elementName}.ts`));
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

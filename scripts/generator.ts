import { unlink, writeFile, readFile } from 'node:fs/promises';
import { relative, resolve, basename } from 'node:path';
import { globIterate as glob } from 'glob';
import { createPrinter, createSourceFile, NewLineKind, ScriptKind, ScriptTarget, type SourceFile } from 'typescript';
import type { HtmlElement as SchemaHTMLElement, JSONSchemaForWebTypes } from '../types/schema.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, utilsDir, packageDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import { camelCase, createImportPath, pickNamedEvents, search, convertElementNameToClassName } from './utils/misc.js';
import { eventSettings, type GenericElementInfo, genericElements, NonGenericInterface } from './utils/settings.js';

type ElementData = Readonly<{
  packageName: string;
  path: string;
}>;

// Remove all existing files
for await (const path of glob(resolve(generatedDir, '**/*'))) {
  await unlink(path);
}

const packagePath = resolve(packageDir, './package.json');
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const dependencies = Object.keys(packageJson.dependencies);

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

      if (path && dependencies.includes(packageName)) {
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

const printer = createPrinter({
  newLine: NewLineKind.LineFeed,
  removeComments: false,
});

function createIfElse(condition: boolean) {
  return (positive = '', negative = '') => (condition ? positive : negative);
}

function createGenerics({ numberOfGenerics, typeConstraints, nonGenericInterfaces }: GenericElementInfo) {
  const typeArguments = Array.from({ length: numberOfGenerics }, (_, i) => `T${i + 1}`);
  const typeParameters = typeArguments
    .map((generic, index) => [generic, typeConstraints?.[index]] as const)
    .map(([generic, constraint]) => (constraint ? `${generic} extends ${constraint}` : generic));

  let eventMapTypeArguments: typeof typeArguments = [];
  let eventMapTypeParameters: typeof typeParameters = [];

  if (!nonGenericInterfaces?.includes(NonGenericInterface.EVENT_MAP)) {
    eventMapTypeArguments = typeArguments;
    eventMapTypeParameters = typeParameters;
  }

  return {
    typeParameters: toGenericsString(typeParameters),
    typeArguments: toGenericsString(typeArguments),
    eventMapTypeArguments: toGenericsString(eventMapTypeArguments),
    eventMapTypeParameters: toGenericsString(eventMapTypeParameters),
  };
}

function toGenericsString(generics: readonly string[]) {
  return generics.length > 0 ? `<${generics.join(', ')}>` : '';
}

function generateReactComponent({ name, js }: SchemaHTMLElement, { packageName, path }: ElementData): SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const elementName = convertElementNameToClassName(name);
  const elementModulePath = createImportPath(relative(nodeModulesDir, path), false);
  const createComponentPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);

  const hasEvents = createIfElse(!!js?.events && js.events.length > 0);
  const events = js?.events;
  const eventNameMissingLogger = () => console.error(`[${packageName}]: event name is missing`);
  const namedEvents = pickNamedEvents(events, eventNameMissingLogger);
  const { remove: eventsToRemove, makeUnknown: eventsToBeUnknown } = eventSettings.get(elementName) ?? {};
  const existingEvents = namedEvents?.filter(({ name: eventName }) =>
    eventsToRemove ? !eventsToRemove.includes(eventName) : true,
  );
  const hasKnownEvents = createIfElse(
    !!namedEvents?.some(({ name }) => !eventsToRemove?.includes(name) && !eventsToBeUnknown?.includes(name)),
  );
  const genericElementInfo = genericElements.get(elementName);
  const {
    typeArguments = '',
    typeParameters = '',
    eventMapTypeArguments = '',
    eventMapTypeParameters = '',
  } = genericElementInfo ? createGenerics(genericElementInfo) : {};

  const code = `${hasEvents(`import type { EventName } from '@lit/react';`)}
import {
  ${elementName} as ${elementName}Element,
  ${hasKnownEvents(`type ${elementName}EventMap as _${elementName}EventMap,`)}
  ${Array.from(new Set(genericElementInfo?.typeConstraints || []), (constraint) => `type ${constraint}`).join(',\n')},
} from '${elementModulePath}';
import * as React from 'react';
import { createComponent, type WebComponentProps } from '${createComponentPath}';

export * from '${elementModulePath}';

export {
  ${elementName}Element,
};

${hasEvents(`export type ${elementName}EventMap${eventMapTypeParameters} = Readonly<{
  ${existingEvents
    ?.map(
      ({ name: eventName }) =>
        `on${camelCase(eventName!)}: EventName<${
          eventsToBeUnknown?.includes(eventName!)
            ? 'CustomEvent<unknown>'
            : `_${elementName}EventMap${eventMapTypeArguments}['${eventName!}']`
        }>`,
    )
    .join(',\n')}
}>;

const events = {
  ${existingEvents?.map(({ name: eventName }) => `'on${camelCase(eventName!)}': '${eventName}'`).join(',\n')}
} as ${elementName}EventMap${eventMapTypeArguments ? '<any>' : ''};`)}

export type ${elementName}Props${typeParameters} = WebComponentProps<${elementName}Element${typeArguments}${hasKnownEvents(`, ${elementName}EventMap${eventMapTypeArguments}`)}>;
export const ${elementName} = createComponent({
  elementClass: ${elementName}Element,
  events${hasEvents(undefined, ': {}')},
  react: React,
  tagName: '${name}'
}) as ${typeParameters}(
  props: ${elementName}Props${typeArguments} & React.RefAttributes<${elementName}Element${typeArguments}>,
) => React.ReactElement | null;
`;

  return createSourceFile(
    resolve(generatedDir, `${elementName}.ts`),
    code,
    ScriptTarget.ES2019,
    undefined,
    ScriptKind.TS,
  );
}

const elementFilesMap = await prepareElementFiles(descriptions);

const sourceFiles = Array.from(elementFilesMap.entries(), ([element, data]) => generateReactComponent(element, data));

const elementNames = sourceFiles.map(({ fileName }) => basename(fileName, '.ts'));

function generateIndexFile(elementNames: readonly string[], extension: string): SourceFile {
  const sourceLines = [...elementNames.map((elementName) => `export * from './${elementName}.js';`)];

  return createSourceFile(
    resolve(packageDir, `index.${extension}`),
    sourceLines.join('\n'),
    ScriptTarget.ES2019,
    undefined,
    ScriptKind.TS,
  );
}

const indexDtsFile = generateIndexFile(elementNames, 'd.ts');

const indexJsFile = generateIndexFile(elementNames, 'js');

async function printAndWrite(file: SourceFile) {
  const contents = printer.printFile(file);
  await writeFile(file.fileName, contents, 'utf8');
}

await Promise.all([...sourceFiles.map(printAndWrite), printAndWrite(indexDtsFile), printAndWrite(indexJsFile)]);

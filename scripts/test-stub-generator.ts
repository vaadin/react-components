import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { nodeModulesDir, srcDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import { camelCase, exists, hasOverrideKey, search, stripPrefix, template } from "./utils/misc.js";

const shouldOverride = hasOverrideKey(process.argv.slice(2));

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({});

if (shouldOverride) {
  await fromAsync(fswalk(srcDir), ([path]) => unlink(path));
}

const COMPONENT_NAME = '$COMPONENT_NAME$';

await Promise.all(
  Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
    if (!element.name) {
      throw new ElementNameMissingError(packageName);
    }

    if (!(await search([`${element.name}.js`], resolve(nodeModulesDir, packageName)))) {
      return;
    }

    const moduleName = stripPrefix(camelCase(element.name));
    const modulePath = resolve(srcDir, `${moduleName}.ts`);

    if (!(await exists(modulePath)) || shouldOverride) {
      const tpl = template(`
import React from 'react';
import ReactDOM from 'react-dom/client';
import testUtils from 'react-dom/test-utils';
import { expect } from '@esm-bundle/chai';
import { ${COMPONENT_NAME}, ${COMPONENT_NAME}Module } from './App';
      `, statements => statements)
    }
  }),
);

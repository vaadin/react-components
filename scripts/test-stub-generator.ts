import { unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { nodeModulesDir, srcDir, testDir } from "./utils/config.js";
import { ElementNameMissingError, warnAboutExistingFile } from './utils/errors.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import {
  camelCase,
  createSourceFile,
  exists,
  hasOverrideKey,
  search,
  stripPrefix,
  template,
  transform,
} from './utils/misc.js';

const shouldOverride = hasOverrideKey(process.argv.slice(2));

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({});

if (shouldOverride) {
  await fromAsync(fswalk(testDir), ([path]) => unlink(path));
}

const COMPONENT_NAME = '$COMPONENT_NAME$';
const ELEMENT_TAG = '$ELEMENT_TAG$';

await Promise.all(
  Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
    if (!element.name) {
      throw new ElementNameMissingError(packageName);
    }

    if (!(await search(element.name, resolve(nodeModulesDir, packageName)))) {
      return;
    }

    const moduleName = stripPrefix(camelCase(element.name));
    const modulePath = resolve(testDir, `${moduleName}.spec.tsx`);

    if (!(await exists(modulePath)) || shouldOverride) {
      const statements = template(
        `
import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { ${COMPONENT_NAME} } from '../src/${COMPONENT_NAME}.js';

describe('${COMPONENT_NAME}', () => {
  it('should render correctly', () => {
    render(<${COMPONENT_NAME} />);
    expect(document.querySelector('${ELEMENT_TAG}')).not.to.be.undefined;
  });
});
        `,
        (s) => s,
        [
          transform((node) =>
            ts.isIdentifier(node) && node.text === COMPONENT_NAME ? ts.factory.createIdentifier(moduleName) : node,
          ),
          transform((node) =>
            ts.isStringLiteral(node) && node.text.includes(COMPONENT_NAME)
              ? ts.factory.createStringLiteral(node.text.replaceAll(COMPONENT_NAME, moduleName))
              : node,
          ),
          transform((node) =>
            ts.isStringLiteral(node) && node.text.includes(ELEMENT_TAG)
              ? ts.factory.createStringLiteral(node.text.replaceAll(ELEMENT_TAG, element.name!))
              : node,
          ),
        ],
      );

      const sourceFile = createSourceFile(statements, modulePath);
      const contents = printer.printFile(sourceFile);

      await writeFile(modulePath, contents, 'utf8');
    } else {
      warnAboutExistingFile(modulePath);
    }

    return modulePath;
  }),
);

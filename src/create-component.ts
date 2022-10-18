import { createComponent as createComponentOriginal, EventName } from '@lit-labs/react';

export function createComponent(...args: Parameters<typeof createComponentOriginal>) {
  // TODO: improve or remove the Polymer workaround
  // 'createComponent' relies on key presence on the custom element class, but
  // Polymer defines properties on the prototype when the first element
  // is created. Workaround, create a throw-away element to make the prototype
  // reliable for 'createComponent'.
  const [, tagName] = args;
  document.createElement(tagName);
  return createComponentOriginal(...args);
}

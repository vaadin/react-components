import { createComponent as createComponentOriginal } from '@lit-labs/react';
import type { EventName, ReactWebComponent } from '@lit-labs/react/create-component.js';

declare type EventNames = Record<string, EventName | string>;
declare interface Constructor<T> {
  new (): T;
}

// For some reason, using `typeof createComponentOriginal` or any derivatives, like
// `Parameters<typeof createComponentOriginal>` breaks the TypeScript language service,
// so we re-declare of the function here.
export function createComponent<I extends HTMLElement, E extends EventNames = {}>(
  React: typeof import('react'),
  tagName: string,
  elementClass: Constructor<I>,
  events?: E | undefined,
  displayName?: string,
): ReactWebComponent<I, E>;
export function createComponent(...args: any[]): any {
  const elementClass = args[2];
  if ('_properties' in elementClass) {
    // TODO: improve or remove the Polymer workaround
    // 'createComponent' relies on key presence on the custom element class,
    // but Polymer defines properties on the prototype when the first element
    // is created. Workaround: pass a mock object with properties in
    // the prototype.
    args[2] = {
      name: elementClass.name,
      prototype: elementClass._properties,
    };
  }
  return (createComponentOriginal as Function)(...args);
}

import {
  createComponent as _createComponent,
  EventName,
  ReactWebComponent,
  WebComponentProps as _WebComponentProps,
} from '@lit-labs/react';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

// TODO: Remove when types from @lit-labs/react are exported
export type EventNames = Record<string, EventName | string>;

type Constructor<T> = { new (): T };

export type ThemedWebComponentProps<I extends ThemePropertyMixinClass & HTMLElement, E extends EventNames = {}> = Omit<
  _WebComponentProps<I, E>,
  'theme'
> & {
  /**
   * Remove the deprecation warning for React components. In our case, the
   * property is deprecated in favor of an attribute. However, for React, it
   * does not matter if an attribute or a property is set; the same algorithm
   * will be used.
   *
   * @see ThemePropertyMixinClass#theme
   */
  theme?: string;
};

export type WebComponentProps<I extends HTMLElement, E extends EventNames = {}> = I extends ThemePropertyMixinClass
  ? ThemedWebComponentProps<I, E>
  : _WebComponentProps<I, E>;

export type ThemedReactWebComponent<
  I extends ThemePropertyMixinClass & HTMLElement,
  E extends EventNames = {},
> = ForwardRefExoticComponent<PropsWithoutRef<ThemedWebComponentProps<I, E>> & RefAttributes<I>>;

export function createComponent<I extends HTMLElement, E extends EventNames = {}>(
  React: typeof window.React,
  tagName: string,
  elementClass: Constructor<I>,
  events?: E,
  displayName?: string,
): I extends ThemePropertyMixinClass ? ThemedReactWebComponent<I, E> : ReactWebComponent<I, E>;
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

  return (_createComponent as Function)(...args);
}

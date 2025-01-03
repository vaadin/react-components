import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type React from 'react';
import { createElement, useLayoutEffect, useRef, type RefAttributes } from 'react';
import useMergedRefs from './useMergedRefs.js';
import addOrUpdateEventListener from './addOrUpdateEventListener.js';

declare const __VERSION__: string;

declare global {
  interface VaadinRegistration {
    is: string;
    version: string;
  }

  interface Vaadin {
    registrations?: VaadinRegistration[];
  }

  interface Window {
    // @ts-expect-error: Different declaration from one of the dependencies.
    Vaadin?: Vaadin;
  }
}

window.Vaadin ??= {};
window.Vaadin.registrations ??= [];
window.Vaadin.registrations.push({
  is: '@vaadin/react-components',
  version: __VERSION__,
});

export type EventName<T extends Event = Event> = string & {
  __eventType: T;
};

export type EventNames = Record<string, EventName>;
type Constructor<T> = { new (): T; name: string };
type PolymerConstructor<T> = Constructor<T> & { _properties: Record<string, unknown> };
type Options<I extends HTMLElement, E extends EventNames = {}> = Readonly<{
  displayName?: string;
  elementClass: Constructor<I> | PolymerConstructor<I>;
  events?: E;
  react: typeof window.React;
  tagName: string;
}>;

// A map of expected event listener types based on EventNames.
type EventListeners<R extends EventNames> = {
  [K in keyof R]?: R[K] extends EventName ? (e: R[K]['__eventType']) => void : (e: Event) => void;
};

// Props derived from custom element class. Currently has limitations of making
// all properties optional and also surfaces life cycle methods in autocomplete.
// TODO: LoginOverlay has "autofocus" property, so we add it back manually.
type ElementProps<I> = Partial<Omit<I, keyof HTMLElement>> & { autofocus?: boolean };

// Acceptable props to the React component.
type ComponentProps<I, E extends EventNames = {}> = Omit<
  React.HTMLAttributes<I>,
  // Prefer type of provided event handler props or those on element over
  // built-in HTMLAttributes
  keyof E | keyof ElementProps<I>
> &
  EventListeners<E> &
  ElementProps<I>;

export type ThemedWebComponentProps<
  I extends ThemePropertyMixinClass & HTMLElement,
  E extends EventNames = {},
> = ComponentProps<I, E> & {
  /**
   * Attribute that can be used by the component to apply built-in style variants,
   * or to propagate its value to the sub-components in Shadow DOM.
   *
   * @see ThemePropertyMixinClass#_theme
   */
  theme?: string;
};

type AllWebComponentProps<I extends HTMLElement, E extends EventNames = {}> = I extends ThemePropertyMixinClass
  ? ThemedWebComponentProps<I, E>
  : ComponentProps<I, E>;

export type WebComponentProps<I extends HTMLElement, E extends EventNames = {}> = Partial<AllWebComponentProps<I, E>>;

export function createComponent<I extends HTMLElement, E extends EventNames = {}>(
  options: Options<I, E>,
): (props: WebComponentProps<I, E> & RefAttributes<I>) => React.ReactElement {
  const { tagName, events: eventsMap } = options;

  return (props) => {
    const innerRef = useRef<I>(null);
    const finalRef = useMergedRefs(innerRef, props.ref);
    const prevEventsRef = useRef(new Set<string>());

    // Option 1 (no initial property events):
    useLayoutEffect(() => {
      if (eventsMap) {
        const events = new Set(Object.keys(props).filter((event) => eventsMap[event]));
        events.forEach((event) => {
          addOrUpdateEventListener(innerRef.current!, eventsMap[event], props[event]);
        });

        prevEventsRef.current.forEach((event) => {
          if (!events.has(event)) {
            addOrUpdateEventListener(innerRef.current!, eventsMap[event], undefined);
          }
        });

        prevEventsRef.current = events;
      }
    });

    useLayoutEffect(() => {
      return () => {
        if (eventsMap) {
          prevEventsRef.current.forEach((event) => {
            addOrUpdateEventListener(innerRef.current!, eventsMap[event], undefined);
          });
        }
      };
    }, []);

    const finalProps = Object.fromEntries(Object.entries(props).filter(([key]) => !eventsMap?.[key]));

    // Option 2 (initial property events are fired):
    // const finalProps = Object.fromEntries(
    //   Object.entries(props).map(([key, value]) => {
    //     if (eventsMap?.[key]) {
    //       return [`on${eventsMap[key]}`, value];
    //     }
    //     return [key, value];
    //   })
    // );

    return createElement(tagName, { ...finalProps, ref: finalRef });
  };
}

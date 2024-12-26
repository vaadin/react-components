import {
  type ComponentClass,
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useCallback,
  useReducer,
} from 'react';
import { createPortal, flushSync } from 'react-dom';
import type { ReactRenderer, Slice, WebComponentRenderer } from './renderer.js';
import { flushMicrotask } from '../utils/flushMicrotask.js';

export type UseRendererResult<W extends WebComponentRenderer> = readonly [
  portals?: ReadonlyArray<ReactElement | null>,
  renderer?: W,
];

// function isReactComponent<P>(Component: ComponentType<P>): Component is ComponentClass<P> {
//   return Component.prototype.isReactComponent;
// }

const initialState = new Map();

function rendererReducer<W extends WebComponentRenderer>(
  state: Map<HTMLElement, Slice<Parameters<W>, 1>>,
  [root, ...args]: Parameters<W>,
): Map<HTMLElement, Slice<Parameters<W>, 1>> {
  return new Map(state).set(root, args as Slice<Parameters<W>, 1>);
}

export type RendererConfig<W extends WebComponentRenderer> = {
  renderMode?: 'default' | 'sync' | 'microtask';
  portalKey?(root: HTMLElement, ...args: Slice<Parameters<W>, 1>): string;
  shouldRenderPortal?(root: HTMLElement, ...args: Slice<Parameters<W>, 1>): boolean;
};

export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  node: ReactNode,
  convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig<W>,
): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRenderer: ReactRenderer<P> | null | undefined,
  convert: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig<W>,
): UseRendererResult<W>;
export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRendererOrNode: ReactNode | ReactRenderer<P> | null | undefined,
  convert?: (props: Slice<Parameters<W>, 1>) => PropsWithChildren<P>,
  config?: RendererConfig<W>,
): UseRendererResult<W> {
  const [map, update] = useReducer<typeof rendererReducer<W>>(rendererReducer, initialState);
  const renderer = useCallback(
    ((...args: Parameters<W>) => {
      if (config?.renderMode === 'microtask') {
        flushMicrotask(() => update(args));
      } else if (config?.renderMode === 'sync') {
        flushSync(() => update(args));
      } else {
        update(args);
      }
    }) as W,
    [],
  );

  return reactRendererOrNode
    ? [
        Array.from(map.entries())
          .filter(([root, args]) => {
            return config?.shouldRenderPortal?.(root, ...args) ?? true;
          })
          .map(([root, args]) => {
            let children: ReactNode;
            if (typeof reactRendererOrNode === 'function') {
              children = reactRendererOrNode(convert!(args));
            } else {
              children = reactRendererOrNode;
            }

            const key = config?.portalKey?.(root, ...args);
            return createPortal(children, root, key);
          }),
        renderer,
      ]
    : [];
}

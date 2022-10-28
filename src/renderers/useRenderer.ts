import {
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import type { ParametersExceptFirst, WebComponentRenderer } from './renderer.js';

export type UseRendererResult<W extends WebComponentRenderer> = readonly [
  portals?: ReadonlyArray<ReactElement | null>,
  renderer?: W,
];

export function useRenderer<P extends {}, W extends WebComponentRenderer>(
  reactRenderer: ComponentType<P> | null | undefined,
  convert: (props: ParametersExceptFirst<W>) => PropsWithChildren<P>,
): UseRendererResult<W> {
  const map = useRef(new Map<HTMLElement, ParametersExceptFirst<W>>());
  const [, forceRefresh] = useReducer(() => [], []);

  const renderer = useCallback(
    ((root, ...args: ParametersExceptFirst<W>) => {
      map.current.set(root, args);
      forceRefresh();
    }) as W,
    [],
  );

  return reactRenderer
    ? [
        Array.from(map.current.entries()).map(([root, args]) =>
          createPortal(createElement<P>(reactRenderer, convert(args)), root),
        ),
        renderer,
      ]
    : [];
}

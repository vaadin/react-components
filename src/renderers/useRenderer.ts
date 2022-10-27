import {
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactPortal,
  useCallback,
  useState,
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
  const [portals, setPortals] = useState(new Map<HTMLElement, ReactPortal>());

  const renderer = useCallback(
    ((root, ...args: ParametersExceptFirst<W>) => {
      // This function will never be called unless reactRenderer exists,
      // so we could suppress null check here.
      portals.set(root, createPortal(createElement<P>(reactRenderer!, convert(args)), root));
      setPortals(new Map(portals));
    }) as W,
    [reactRenderer],
  );

  return reactRenderer ? [Array.from(portals.values()), renderer] : [];
}

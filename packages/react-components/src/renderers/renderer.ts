import type { ComponentClass, ReactNode } from 'react';

export type Slice<T, N extends number, O extends any[] = []> = O['length'] extends N
  ? T
  : T extends [infer F, ...infer R]
  ? Slice<[...R], N, [...O, F]>
  : never;

export type WebComponentRenderer = (root: HTMLElement, ...args: any[]) => void;

export type ReactRenderer<P> = ReactRendererCallback<P> | ComponentClass<P>;

export const REACT_RENDERER_CALLBACK = Symbol('react-renderer-callback');

export interface ReactRendererCallback<P> {
  (props: P): ReactNode;
  [REACT_RENDERER_CALLBACK]?: unknown;
}

export function isRendererCallback<P>(object: any): object is ReactRendererCallback<P> {
  return typeof object === 'function' && REACT_RENDERER_CALLBACK in object;
}

export function createRendererCallback<P>(callback: (props: P) => ReactNode): ReactRendererCallback<P> {
  const rendererCallback = (props: P) => callback(props);
  rendererCallback[REACT_RENDERER_CALLBACK] = true;
  return rendererCallback;
}

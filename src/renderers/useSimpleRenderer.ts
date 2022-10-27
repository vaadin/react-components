import type { ComponentType, PropsWithChildren } from 'react';
import type { ParametersExceptFirst } from './renderer.js';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type ReactSimpleRendererProps<O extends HTMLElement> = Readonly<{
  original: O;
}>;
export type WebComponentSimpleRenderer<O extends HTMLElement> = (root: HTMLElement, original: O) => void;

function convertSimpleRendererArgs<O extends HTMLElement>([original]: ParametersExceptFirst<
  WebComponentSimpleRenderer<O>
>): PropsWithChildren<ReactSimpleRendererProps<O>> {
  return { original };
}

export function useSimpleRenderer<O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  return useRenderer(reactRenderer, convertSimpleRendererArgs);
}

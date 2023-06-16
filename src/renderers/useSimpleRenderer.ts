import type { ComponentType } from 'react';
import { createElement } from 'react';
import { createPortal } from 'react-dom';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type ReactSimpleRendererProps<O extends HTMLElement> = Readonly<{
  original: O;
}>;
export type WebComponentSimpleRenderer<O extends HTMLElement> = (root: HTMLElement, original: O) => void;

export function useSimpleRenderer<O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  return useRenderer(
    reactRenderer && ((root, [original]) => createPortal(createElement(reactRenderer, { original }), root)),
  );
}

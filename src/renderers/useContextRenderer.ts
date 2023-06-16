import type { ComponentType } from 'react';
import { createElement } from 'react';
import { createPortal } from 'react-dom';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type ReactContextRendererProps<C, O extends HTMLElement> = Readonly<{
  context: C;
  original: O;
}>;

export type WebComponentContextRenderer<C, O extends HTMLElement> = (
  root: HTMLElement,
  original: O,
  context: C,
) => void;

export function useContextRenderer<C, O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactContextRendererProps<C, O>> | null,
): UseRendererResult<WebComponentContextRenderer<C, O>> {
  return useRenderer(
    reactRenderer &&
      ((root, [original, context]) => createPortal(createElement(reactRenderer, { context, original }), root)),
  );
}

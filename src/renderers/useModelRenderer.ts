import type { ComponentType } from 'react';
import { createElement } from 'react';
import { createPortal } from 'react-dom';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type Model<I> = Readonly<{
  index: number;
  item: I;
}>;

export type ReactModelRendererProps<I, M extends Model<I>, O extends HTMLElement> = Readonly<{
  item: I;
  model: M;
  original: O;
}>;

export type WebComponentModelRenderer<I, M extends Model<I>, O extends HTMLElement> = (
  root: HTMLElement,
  original: O,
  model: M,
) => void;

export function useModelRenderer<I, M extends Model<I>, O extends HTMLElement>(
  /**
   * A React component to render an item of the list or grid.
   */ 
   reactRenderer?: ComponentType<ReactModelRendererProps<I, M, O>> | null,
  /**
   * Could be used to apply tweaks for the root element of the renderer of the specific component to fix issues.
   *
   * @param root
   */
  tweakRoot?: (root: HTMLElement) => void,
): UseRendererResult<WebComponentModelRenderer<I, M, O>> {
  return useRenderer(
    reactRenderer &&
      ((root, [original, model]) => {
        tweakRoot?.(root);
        return createPortal(
          createElement(reactRenderer, { item: model.item, model, original }),
          root,
          String(model.index),
        );
      }),
  );
}

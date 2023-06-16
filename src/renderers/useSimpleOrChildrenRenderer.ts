import type { ComponentType, ReactNode } from 'react';
import { createElement } from 'react';
import { createPortal } from 'react-dom';
import type { UseRendererResult } from './useRenderer.js';
import { useRenderer } from './useRenderer.js';
import { type ReactSimpleRendererProps, type WebComponentSimpleRenderer } from './useSimpleRenderer.js';

export function useSimpleOrChildrenRenderer<O extends HTMLElement>(
  fnRenderer?: ComponentType<ReactSimpleRendererProps<O>> | null,
  children?: ReactNode | ComponentType<ReactSimpleRendererProps<O>>,
): UseRendererResult<WebComponentSimpleRenderer<O>> {
  return useRenderer(
    children || fnRenderer
      ? (root, [original]) => {
          let node: ReactNode | undefined;

          if (typeof children === 'function') {
            node = createElement(children, { original });
          } else if (fnRenderer) {
            node = createElement(fnRenderer, { original });
          } else {
            node = children;
          }

          return createPortal(node, root);
        }
      : null,
  );
}

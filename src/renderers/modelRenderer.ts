import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type Model<I> = Readonly<{
  item: I;
}>;

export type ReactModelRenderer<I, M extends Model<I>, O extends HTMLElement> = (
  item: I,
  model: M,
  element: O,
) => ReactNode;

export type WebComponentModelRenderer<I, M extends Model<I>, O extends HTMLElement> = (
  root: HTMLElement,
  original: O,
  model: M,
) => void;

export function createModelRenderer<I, M extends Model<I>, O extends HTMLElement>(
  reactRenderer: ReactModelRenderer<I, M, O>,
): WebComponentModelRenderer<I, M, O> {
  return (root, original, model) => createPortal(reactRenderer(model.item, model, original), root);
}

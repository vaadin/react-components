import type { ComponentType } from 'react';
import type { ParametersExceptFirst } from './renderer.js';
import { useRenderer, type UseRendererResult } from './useRenderer.js';

export type Model<I> = Readonly<{
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

function convertModelRendererArgs<I, M extends Model<I>, O extends HTMLElement>([
  original,
  model,
]: ParametersExceptFirst<WebComponentModelRenderer<I, M, O>>): ReactModelRendererProps<I, M, O> {
  return { item: model.item, model, original };
}

export function useModelRenderer<I, M extends Model<I>, O extends HTMLElement>(
  reactRenderer?: ComponentType<ReactModelRendererProps<I, M, O>> | null,
): UseRendererResult<WebComponentModelRenderer<I, M, O>> {
  return useRenderer(reactRenderer, convertModelRendererArgs);
}

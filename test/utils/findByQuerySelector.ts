import { waitFor } from '@testing-library/react';

export async function findByQuerySelector<K extends keyof HTMLElementTagNameMap>(
  query: K,
  container?: Document | HTMLElement,
): Promise<HTMLElementTagNameMap[K]>;
export async function findByQuerySelector<E extends Element = Element>(
  query: string,
  container?: Document | HTMLElement,
): Promise<E>;
export async function findByQuerySelector(
  query: string,
  container: Document | HTMLElement = document,
): Promise<Element> {
  return await waitFor(() => container.querySelector(query)!);
}

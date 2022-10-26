import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export type ReactSimpleRenderer<O extends HTMLElement> = (original: O) => ReactNode;
export type WebComponentSimpleRenderer<O extends HTMLElement> = (root: HTMLElement, original: O) => void;

export function createSimpleRenderer<O extends HTMLElement>(
  reactRenderer: ReactSimpleRenderer<O>
): WebComponentSimpleRenderer<O> {
  return (root, original) => createPortal(reactRenderer(original), root);
}

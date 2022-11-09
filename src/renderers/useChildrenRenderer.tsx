import type { PropsWithChildren, ReactNode } from "react";
import { useRenderer } from "./useRenderer.js";

function ChildrenRenderer({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function useChildrenRenderer(children?: ReactNode) {
  return useRenderer(ChildrenRenderer, () => ({ children }));
}

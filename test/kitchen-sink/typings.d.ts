import { VirtualList } from '@vaadin/virtual-list';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  declare module '*.module.css' {
    const css: Record<string, string>;
    export default css;
  }

  namespace JSX {
    interface IntrinsicElements {
      'vaadin-virtual-list': DetailedHTMLProps<HTMLAttributes<VirtualList>, VirtualList> & { class?: string };
    }
  }
}

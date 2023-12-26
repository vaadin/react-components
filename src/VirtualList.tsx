import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  VirtualList as _VirtualList,
  type VirtualListElement,
  type VirtualListProps as _VirtualListProps,
} from './generated/VirtualList.js';
import { type ReactModelRendererProps, useModelRenderer } from './renderers/useModelRenderer.js';
import type { VirtualListDefaultItem, VirtualListItemModel } from '@vaadin/virtual-list';

export * from './generated/VirtualList.js';

export type VirtualListReactRendererProps<TItem> = ReactModelRendererProps<
  TItem,
  VirtualListItemModel<TItem>,
  VirtualListElement<TItem>
>;

export type VirtualListProps<TItem> = Partial<Omit<_VirtualListProps<TItem>, 'children' | 'renderer'>> &
  Readonly<{
    children?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
    renderer?: ComponentType<VirtualListReactRendererProps<TItem>> | null;
  }>;

function VirtualList<TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem>,
  ref: ForwardedRef<VirtualListElement<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_VirtualList<TItem> {...props} ref={ref} renderer={renderer}>
      {portals}
    </_VirtualList>
  );
}

const ForwardedVirtualList = forwardRef(VirtualList) as <TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem> & RefAttributes<VirtualListElement<TItem>>,
) => ReactElement | null;

export { ForwardedVirtualList as VirtualList };

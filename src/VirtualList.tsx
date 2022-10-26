import type { VirtualListDefaultItem } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  VirtualList as _VirtualList,
  VirtualListModule,
  type VirtualListProps as _VirtualListProps,
} from './generated/VirtualList.js';
import { createModelRenderer } from './renderers/modelRenderer.js';
import type { ReactModelRenderer } from './renderers/modelRenderer.js';

export type VirtualListReactRenderer<TItem> = ReactModelRenderer<
  TItem,
  VirtualListModule.VirtualListItemModel<TItem>,
  VirtualListModule.VirtualList<TItem>
>;

export type VirtualListProps<TItem> = Omit<_VirtualListProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: VirtualListReactRenderer<TItem>;
  }>;

function VirtualList<TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem>,
  ref: ForwardedRef<VirtualListModule.VirtualList<TItem>>,
): ReactElement | null {
  return <_VirtualList<TItem> {...props} ref={ref} renderer={props.renderer && createModelRenderer(props.renderer)} />;
}

const ForwardedVirtualList = forwardRef(VirtualList) as <TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem> & { ref?: ForwardedRef<VirtualListModule.VirtualList<TItem>> },
) => ReactElement | null;

export { ForwardedVirtualList as VirtualList, VirtualListModule };

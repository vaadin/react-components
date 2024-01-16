import {
  type ComponentType,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type ReactElement,
  type RefAttributes,
} from 'react';
import {
  VirtualList as _VirtualList,
  type VirtualListDefaultItem,
  type VirtualListElement,
  type VirtualListItemModel,
  type VirtualListProps as _VirtualListProps,
} from './generated/VirtualList.js';
import { type ReactModelRendererProps, useModelRenderer } from './renderers/useModelRenderer.js';

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

function withDefine<T extends typeof VirtualList>(component: T): T & { define: () => Promise<void> } {
  Object.assign(component, { define: _VirtualList.define });
  return component as T & { define: () => Promise<void> };
}

const ForwardedVirtualList = forwardRef(VirtualList) as <TItem = VirtualListDefaultItem>(
  props: VirtualListProps<TItem> & RefAttributes<VirtualListElement<TItem>>,
) => ReactElement | null;

const VirtualListWithDefine = withDefine(ForwardedVirtualList);

export { VirtualListWithDefine as VirtualList };

import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  GridTreeColumnElement,
  GridTreeColumn as _GridTreeColumn,
  type GridTreeColumnProps as _GridTreeColumnProps,
} from './generated/GridTreeColumn.js';
import type { GridEdgeReactRendererProps } from './renderers/grid.js';
import { useSimpleRenderer } from './renderers/useSimpleRenderer.js';

export * from './generated/GridTreeColumn.js';

export type GridTreeColumnProps<TItem> = Partial<
  Omit<_GridTreeColumnProps<TItem>, 'children' | 'footerRenderer' | 'headerRenderer' | 'renderer'>
> &
  Readonly<{
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
  }>;

function GridTreeColumn<TItem = GridDefaultItem>(
  props: GridTreeColumnProps<TItem>,
  ref: ForwardedRef<GridTreeColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer, { renderSync: true });
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer, { renderSync: true });

  return (
    <_GridTreeColumn<TItem> {...props} headerRenderer={headerRenderer} footerRenderer={footerRenderer} ref={ref}>
      {headerPortals}
      {footerPortals}
    </_GridTreeColumn>
  );
}

const ForwardedGridTreeColumn = forwardRef(GridTreeColumn) as <TItem = GridDefaultItem>(
  props: GridTreeColumnProps<TItem> & RefAttributes<GridTreeColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridTreeColumn as GridTreeColumn };
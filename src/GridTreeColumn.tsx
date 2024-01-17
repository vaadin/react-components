import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  type GridTreeColumnElement,
  GridTreeColumn as _GridTreeColumn,
  type GridTreeColumnProps as _GridTreeColumnProps,
} from './generated/GridTreeColumn.js';
import type { GridEdgeReactRendererProps } from './renderers/grid.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridTreeColumn.js';

export type GridTreeColumnProps<TItem> = Partial<
  Omit<
    _GridTreeColumnProps<TItem>,
    | 'children'
    | 'footerRenderer'
    | 'header'
    | 'headerRenderer'
    | 'renderer'
    | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    footer?: ReactNode;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    header?: ReactNode;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
  }>;

function GridTreeColumn<TItem = GridDefaultItem>(
  { footer, header, ...props }: GridTreeColumnProps<TItem>,
  ref: ForwardedRef<GridTreeColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });

  return (
    <_GridTreeColumn<TItem> {...props} headerRenderer={headerRenderer} footerRenderer={footerRenderer} ref={ref}>
      {headerPortals}
      {footerPortals}
    </_GridTreeColumn>
  );
}

function withDefine<T extends typeof GridTreeColumn>(component: T): T & { define: () => Promise<void> } {
  Object.assign(component, { define: _GridTreeColumn.define });
  return component as T & { define: () => Promise<void> };
}

const ForwardedGridTreeColumn = forwardRef(GridTreeColumn) as <TItem = GridDefaultItem>(
  props: GridTreeColumnProps<TItem> & RefAttributes<GridTreeColumnElement<TItem>>,
) => ReactElement | null;

const GridTreeColumnWithDefine = withDefine(ForwardedGridTreeColumn);

export { GridTreeColumnWithDefine as GridTreeColumn };

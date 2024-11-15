import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  useRef,
} from 'react';
import type { GridDefaultItem } from './generated/Grid.js';
import {
  GridTreeColumnElement,
  GridTreeColumn as _GridTreeColumn,
  type GridTreeColumnProps as _GridTreeColumnProps,
} from './generated/GridTreeColumn.js';
import type { GridEdgeReactRendererProps } from './renderers/grid.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
import useMergedRefs from './utils/useMergedRefs.js';
import { useGridColumn } from './Grid.js';

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
    /**
     * @deprecated Use `footer` instead.
     */
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    header?: ReactNode;
    /**
     * @deprecated Use `header` instead.
     */
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
  }>;

function GridTreeColumn<TItem = GridDefaultItem>(
  { footer, header, ...props }: GridTreeColumnProps<TItem>,
  ref: ForwardedRef<GridTreeColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header);
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);

  const innerRef = useRef<GridTreeColumnElement<TItem>>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  const isRendered = (!headerRenderer || headerPortals!.length > 0) && (!footerRenderer || footerPortals!.length > 0);
  useGridColumn(innerRef, isRendered);

  return (
    <_GridTreeColumn<TItem> {...props} headerRenderer={headerRenderer} footerRenderer={footerRenderer} ref={finalRef}>
      {headerPortals}
      {footerPortals}
    </_GridTreeColumn>
  );
}

const ForwardedGridTreeColumn = forwardRef(GridTreeColumn) as <TItem = GridDefaultItem>(
  props: GridTreeColumnProps<TItem> & RefAttributes<GridTreeColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridTreeColumn as GridTreeColumn };

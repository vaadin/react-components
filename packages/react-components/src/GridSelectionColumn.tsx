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
  GridSelectionColumn as _GridSelectionColumn,
  type GridSelectionColumnElement,
  type GridSelectionColumnProps as _GridSelectionColumnProps,
} from './generated/GridSelectionColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';
import { useGridColumn } from './Grid.js';
import useMergedRefs from './utils/useMergedRefs.js';

export * from './generated/GridSelectionColumn.js';

export type GridSelectionColumnProps<TItem> = Partial<
  Omit<
    _GridSelectionColumnProps<TItem>,
    | 'children'
    | 'footerRenderer'
    | 'headerRenderer'
    | 'renderer'
    | 'header'
    | keyof OmittedGridColumnHTMLAttributes<TItem>
  >
> &
  Readonly<{
    children?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
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
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridSelectionColumn<TItem = GridDefaultItem>(
  { footer, header, ...props }: GridSelectionColumnProps<TItem>,
  ref: ForwardedRef<GridSelectionColumnElement<TItem>>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header);
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? props.children);

  const innerRef = useRef<GridSelectionColumnElement<TItem>>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  const isRendered =
    (!headerRenderer || headerPortals!.length > 0) &&
    (!footerRenderer || footerPortals!.length > 0) &&
    (!bodyRenderer || bodyPortals!.length > 0);
  useGridColumn(innerRef, isRendered);

  return (
    <_GridSelectionColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={finalRef}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridSelectionColumn>
  );
}

const ForwardedGridSelectionColumn = forwardRef(GridSelectionColumn) as <TItem = GridDefaultItem>(
  props: GridSelectionColumnProps<TItem> & RefAttributes<GridSelectionColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridSelectionColumn as GridSelectionColumn };

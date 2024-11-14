import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  useContext,
  useEffect,
  useRef,
} from 'react';
import type { GridDefaultItem, GridElement } from './generated/Grid.js';
import {
  GridColumn as _GridColumn,
  type GridColumnElement,
  type GridColumnProps as _GridColumnProps,
} from './generated/GridColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';
import { GridContext } from './Grid.js';

export * from './generated/GridColumn.js';

// Properties from HTMLAttributes that are omitted from all GridColumn types
export type OmittedGridColumnHTMLAttributes<TItem> = Omit<
  React.HTMLAttributes<GridColumnElement<TItem>>,
  'hidden' | 'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'children' | 'title'
>;

export type GridColumnProps<TItem> = Partial<
  Omit<
    _GridColumnProps<TItem>,
    | 'children'
    | 'footerRenderer'
    | 'header'
    | 'headerRenderer'
    | 'renderer'
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

function GridColumn<TItem = GridDefaultItem>(
  { children, footer, header, ...props }: GridColumnProps<TItem>,
  ref: ForwardedRef<GridColumnElement<TItem>>,
): ReactElement | null {
  const { gridRef } = useContext(GridContext)!;

  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header);
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer ?? children);

  const innerRef = useRef<GridColumnElement<TItem>>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    const columnElement = innerRef.current;
    if (!props.autoWidth || !gridElement || !columnElement || !bodyPortals) {
      return;
    }

    if (!columnElement.hidden && bodyPortals.length > 0) {
      // @ts-ignore
      gridElement._recalculateColumnWidths([columnElement]);
      // @TODO set a flag to recalculate width only once
    }
  }, [bodyPortals]);

  const finalRef = useMergedRefs(innerRef, ref);

  return (
    <_GridColumn<TItem>
      {...props}
      footerRenderer={footerRenderer}
      headerRenderer={headerRenderer}
      ref={finalRef}
      renderer={bodyRenderer}
    >
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridColumn>
  );
}

const ForwardedGridColumn = forwardRef(GridColumn) as <TItem = GridDefaultItem>(
  props: GridColumnProps<TItem> & RefAttributes<GridColumnElement<TItem>>,
) => ReactElement | null;

export { ForwardedGridColumn as GridColumn };

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
import type { GridDefaultItem } from './generated/Grid.js';
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
  const gridContext = useContext(GridContext)!;

  const [headerPortals, headerRenderer, isHeaderRendered] = useSimpleOrChildrenRenderer(props.headerRenderer, header);
  const [footerPortals, footerRenderer, isFooterRendered] = useSimpleOrChildrenRenderer(props.footerRenderer, footer);
  const [bodyPortals, bodyRenderer, isBodyRendered] = useModelRenderer(props.renderer ?? children);
  const isRendered =
    (!headerRenderer || isHeaderRendered) && (!footerRenderer || isFooterRendered) && (!bodyRenderer || isBodyRendered);

  const innerRef = useRef<GridColumnElement<TItem>>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (isRendered) {
      gridContext.onColumnRendered(innerRef.current!);
    }
  }, [isRendered]);

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

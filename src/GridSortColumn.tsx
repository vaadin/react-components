import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridSortColumn as _GridSortColumn,
  GridSortColumnModule,
  type GridSortColumnProps as _GridSortColumnProps,
} from './generated/GridSortColumn.js';
import type { GridBodyReactRenderer, GridEdgeReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from './renderers/modelRenderer.js';
import { createSimpleRenderer } from './renderers/simpleRenderer.js';

export type GridSortColumnProps<TItem> = Omit<
  _GridSortColumnProps<TItem>,
  'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    footerRenderer?: GridEdgeReactRenderer<TItem> | null;
    headerRenderer?: GridEdgeReactRenderer<TItem> | null;
    renderer?: GridBodyReactRenderer<TItem> | null;
  }>;

function GridSortColumn<TItem = GridModule.GridDefaultItem>(
  props: GridSortColumnProps<TItem>,
  ref: ForwardedRef<GridSortColumnModule.GridSortColumn<TItem>>,
): ReactElement | null {
  return (
    <_GridSortColumn<TItem>
      {...props}
      footerRenderer={props.footerRenderer && createSimpleRenderer(props.footerRenderer)}
      headerRenderer={props.headerRenderer && createSimpleRenderer(props.headerRenderer)}
      ref={ref}
      renderer={props.renderer && createModelRenderer(props.renderer)}
    />
  );
}

const ForwardedGridSortColumn = forwardRef(GridSortColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridSortColumnProps<TItem> & { ref?: ForwardedRef<GridSortColumnModule.GridSortColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridSortColumn as GridSortColumn, GridSortColumnModule };

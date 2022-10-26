import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridColumn as _GridColumn,
  GridColumnModule,
  type GridColumnProps as _GridColumnProps,
} from './generated/GridColumn.js';
import type { GridBodyReactRenderer, GridEdgeReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from './renderers/modelRenderer.js';
import { createSimpleRenderer } from './renderers/simpleRenderer.js';

export type GridColumnProps<TItem> = Omit<_GridColumnProps<TItem>, 'footerRenderer' | 'headerRenderer' | 'renderer'> &
  Readonly<{
    footerRenderer?: GridEdgeReactRenderer<TItem> | null;
    headerRenderer?: GridEdgeReactRenderer<TItem> | null;
    renderer?: GridBodyReactRenderer<TItem> | null;
  }>;

function GridColumn<TItem = GridModule.GridDefaultItem>(
  props: GridColumnProps<TItem>,
  ref: ForwardedRef<GridColumnModule.GridColumn<TItem>>,
): ReactElement | null {
  return (
    <_GridColumn<TItem>
      {...props}
      footerRenderer={props.footerRenderer && createSimpleRenderer(props.footerRenderer)}
      headerRenderer={props.headerRenderer && createSimpleRenderer(props.headerRenderer)}
      ref={ref}
      renderer={props.renderer && createModelRenderer(props.renderer)}
    />
  );
}

const ForwardedGridColumn = forwardRef(GridColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridColumnProps<TItem> & { ref?: ForwardedRef<GridColumnModule.GridColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridColumn as GridColumn, GridColumnModule };

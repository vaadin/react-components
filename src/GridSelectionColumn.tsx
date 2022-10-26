import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridSelectionColumn as _GridSelectionColumn,
  GridSelectionColumnModule,
  type GridSelectionColumnProps as _GridSelectionColumnProps,
} from './generated/GridSelectionColumn.js';
import type { GridBodyReactRenderer, GridEdgeReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from "./renderers/modelRenderer.js";
import { createSimpleRenderer } from "./renderers/simpleRenderer.js";

export type GridSelectionColumnProps<TItem> = Omit<
  _GridSelectionColumnProps<TItem>,
  'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    footerRenderer?: GridEdgeReactRenderer<TItem> | null;
    headerRenderer?: GridEdgeReactRenderer<TItem> | null;
    renderer?: GridBodyReactRenderer<TItem> | null;
  }>;

function GridSelectionColumn<TItem = GridModule.GridDefaultItem>(
  props: GridSelectionColumnProps<TItem>,
  ref: ForwardedRef<GridSelectionColumnModule.GridSelectionColumn<TItem>>,
): ReactElement | null {
  return (
    <_GridSelectionColumn<TItem>
      {...props}
      footerRenderer={props.footerRenderer && createSimpleRenderer(props.footerRenderer)}
      headerRenderer={props.headerRenderer && createSimpleRenderer(props.headerRenderer)}
      ref={ref}
      renderer={props.renderer && createModelRenderer(props.renderer)}
    />
  );
}

const ForwardedGridSelectionColumn = forwardRef(GridSelectionColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridSelectionColumnProps<TItem> & { ref?: ForwardedRef<GridSelectionColumnModule.GridSelectionColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridSelectionColumn as GridSelectionColumn, GridSelectionColumnModule };

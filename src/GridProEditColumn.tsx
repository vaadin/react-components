import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import {
  GridProEditColumn as _GridProEditColumn,
  GridProEditColumnModule,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import type { GridBodyReactRenderer, GridEdgeReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from "./renderers/modelRenderer.js";
import { createSimpleRenderer } from "./renderers/simpleRenderer.js";

export type GridProEditColumnProps<TItem> = Omit<
  _GridProEditColumnProps<TItem>,
  'editModeRenderer' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    editModeRenderer?: GridBodyReactRenderer<TItem> | null;
    footerRenderer?: GridEdgeReactRenderer<TItem> | null;
    headerRenderer?: GridEdgeReactRenderer<TItem> | null;
    renderer?: GridBodyReactRenderer<TItem> | null;
  }>;

function GridProEditColumn<TItem = GridModule.GridDefaultItem>(
  props: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnModule.GridProEditColumn<TItem>>,
): ReactElement | null {
  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={props.editModeRenderer && createModelRenderer(props.editModeRenderer)}
      footerRenderer={props.footerRenderer && createSimpleRenderer(props.footerRenderer)}
      headerRenderer={props.headerRenderer && createSimpleRenderer(props.headerRenderer)}
      ref={ref}
      renderer={props.renderer && createModelRenderer(props.renderer)}
    />
  );
}

const ForwardedGridProEditColumn = forwardRef(GridProEditColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridProEditColumnProps<TItem> & { ref?: ForwardedRef<GridProEditColumnModule.GridProEditColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridProEditColumn as GridProEditColumn, GridProEditColumnModule };

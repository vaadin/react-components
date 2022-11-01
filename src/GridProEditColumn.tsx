import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from "react";
import type { GridModule } from './generated/Grid.js';
import {
  GridProEditColumn as _GridProEditColumn,
  GridProEditColumnModule,
  type GridProEditColumnProps as _GridProEditColumnProps,
} from './generated/GridProEditColumn.js';
import type { GridBodyReactRendererProps, GridEdgeReactRendererProps } from "./renderers/grid.js";
import { useModelRenderer } from "./renderers/useModelRenderer.js";
import { useSimpleRenderer } from "./renderers/useSimpleRenderer.js";

export type GridProEditColumnProps<TItem> = Omit<
  _GridProEditColumnProps<TItem>,
  'editModeRenderer' | 'footerRenderer' | 'headerRenderer' | 'renderer'
> &
  Readonly<{
    editModeRenderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
    footerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    headerRenderer?: ComponentType<GridEdgeReactRendererProps<TItem>> | null;
    renderer?: ComponentType<GridBodyReactRendererProps<TItem>> | null;
  }>;

function GridProEditColumn<TItem = GridModule.GridDefaultItem>(
  props: GridProEditColumnProps<TItem>,
  ref: ForwardedRef<GridProEditColumnModule.GridProEditColumn<TItem>>,
): ReactElement | null {
  const [editModePortals, editModeRenderer] = useModelRenderer(props.editModeRenderer);
  const [headerPortals, headerRenderer] = useSimpleRenderer(props.headerRenderer);
  const [footerPortals, footerRenderer] = useSimpleRenderer(props.footerRenderer);
  const [bodyPortals, bodyRenderer] = useModelRenderer(props.renderer);

  return (
    <_GridProEditColumn<TItem>
      {...props}
      editModeRenderer={editModeRenderer}
      footerRenderer={headerRenderer}
      headerRenderer={footerRenderer}
      ref={ref}
      renderer={bodyRenderer}
    >
      {props.children}
      {editModePortals}
      {headerPortals}
      {footerPortals}
      {bodyPortals}
    </_GridProEditColumn>
  );
}

const ForwardedGridProEditColumn = forwardRef(GridProEditColumn) as <TItem = GridModule.GridDefaultItem>(
  props: GridProEditColumnProps<TItem> & { ref?: ForwardedRef<GridProEditColumnModule.GridProEditColumn<TItem>> },
) => ReactElement | null;

export { ForwardedGridProEditColumn as GridProEditColumn, GridProEditColumnModule };
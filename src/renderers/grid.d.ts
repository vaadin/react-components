import type { GridModule } from "../generated/Grid.js";
import type { GridColumnModule } from "../generated/GridColumn.js";
import type { ReactModelRenderer } from "./modelRenderer.js";
import type { ReactSimpleRenderer } from "./simpleRenderer.js";

export type GridRowDetailsReactRenderer<TItem> = ReactModelRenderer<
  TItem,
  GridModule.GridItemModel<TItem>,
  GridModule.Grid<TItem>
>;

export type GridBodyReactRenderer<TItem> = ReactModelRenderer<
  TItem,
  GridModule.GridItemModel<TItem>,
  GridColumnModule.GridColumn<TItem>
>;

export type GridEdgeReactRenderer<TItem> = ReactSimpleRenderer<GridColumnModule.GridColumn<TItem>>;

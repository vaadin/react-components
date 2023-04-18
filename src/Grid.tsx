import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  Grid as _Grid,
  type GridDefaultItem,
  type GridElement,
  type GridProps as _GridProps,
} from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

// Listing names explicitly to omit re-exports from GridColumn.js
export {
  GridBodyRenderer,
  GridCellClassNameGenerator,
  GridCellPartNameGenerator,
  GridDataProvider,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridDragAndDropFilter,
  GridDropLocation,
  GridDropMode,
  GridEventContext,
  GridFilterDefinition,
  GridHeaderFooterRenderer,
  GridRowDetailsRenderer,
  GridSorterDefinition,
  GridSorterDirection,

  GridDefaultItem,

  GridItemModel,

  GridActiveItemChangedEvent,
  GridCellActivateEvent,
  GridCellFocusEvent,
  GridColumnReorderEvent,
  GridColumnResizeEvent,
  GridDataProviderChangedEvent,
  GridExpandedItemsChangedEvent,
  GridDragStartEvent,
  GridDropEvent,
  GridLoadingChangedEvent,
  GridSelectedItemsChangedEvent,
  GridSizeChangedEvent,

  GridCustomEventMap,
  GridEventMap,
} from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  return (
    <_Grid<TItem> {...props} ref={ref} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_Grid>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridDefaultItem>(
  props: GridProps<TItem> & RefAttributes<GridElement<TItem>>,
) => ReactElement | null;

export { ForwardedGrid as Grid };

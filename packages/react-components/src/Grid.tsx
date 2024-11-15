import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import {
  Grid as _Grid,
  type GridDefaultItem,
  type GridElement,
  type GridProps as _GridProps,
} from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';
import useMergedRefs from './utils/useMergedRefs.js';
import { isElementMarkedAsRendered } from './utils/markElementAsRendered.js';

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function overrideRecalculateColumnWidths(grid: GridElement) {
  const originalRecalculateColumnWidths = grid.recalculateColumnWidths;
  grid.recalculateColumnWidths = function (...args) {
    originalRecalculateColumnWidths.apply(this, args);

    // @ts-ignore
    if (this._getColumns().some((column) => !column.hidden && !isElementMarkedAsRendered(column))) {
      // @ts-ignore
      this.__pendingRecalculateColumnWidths = true;
    }
  };
}

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  const innerRef = useRef<GridElement>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    if (innerRef.current) {
      overrideRecalculateColumnWidths(innerRef.current);
    }
  }, [innerRef.current]);

  return (
    <_Grid<TItem> {...props} ref={finalRef} rowDetailsRenderer={rowDetailsRenderer}>
      {props.children}
      {portals}
    </_Grid>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridDefaultItem>(
  props: GridProps<TItem> & RefAttributes<GridElement<TItem>>,
) => ReactElement | null;

export { ForwardedGrid as Grid };

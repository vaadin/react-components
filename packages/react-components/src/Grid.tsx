import {
  type ComponentType,
  createContext,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  type RefObject,
  useCallback,
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
import { isElementMarkedAsRendered, markElementAsRendered } from './utils/markElementAsRendered.js';

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

type GridContext = {
  onColumnRendered(column: HTMLElement): void;
};

export const GridContext = createContext<GridContext | null>(null);

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  const innerRef = useRef<GridElement>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  useEffect(() => {
    innerRef.current!.recalculateColumnWidths = function (...args) {
      // @ts-ignore
      const autoWidthColumns: HTMLElement[] = this._getColumns().filter((col) => col.autoWidth && !col.hidden);
      if (autoWidthColumns.some((col) => !isElementMarkedAsRendered(col))) {
        // @ts-ignore
        this.__pendingRecalculateColumnWidths = true;
        return;
      }

      // console.log('rendered');

      Object.getPrototypeOf(this).recalculateColumnWidths.apply(this, args);
    };
  }, []);

  const onColumnRendered = useCallback((column: HTMLElement) => {
    markElementAsRendered(column);
    // @ts-ignore
    innerRef.current!.__tryToRecalculateColumnWidthsIfPending();
  }, []);

  return (
    <GridContext.Provider value={{ onColumnRendered }}>
      <_Grid<TItem> {...props} ref={finalRef} rowDetailsRenderer={rowDetailsRenderer}>
        {props.children}
        {portals}
      </_Grid>
    </GridContext.Provider>
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridDefaultItem>(
  props: GridProps<TItem> & RefAttributes<GridElement<TItem>>,
) => ReactElement | null;

export { ForwardedGrid as Grid };

import {
  type ComponentType,
  createContext,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
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
import type { GridColumnElement } from './GridColumn.js';
import type { GridSelectionColumnElement } from './GridSelectionColumn.js';
import type { GridFilterColumnElement } from './GridFilterColumn.js';
import type { GridSortColumnElement } from './GridSortColumn.js';
import type { GridTreeColumnElement } from './GridTreeColumn.js';
import type { GridColumnGroupElement } from './GridColumnGroup.js';

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

type AnyGridColumnElement =
  | GridColumnElement
  | GridSelectionColumnElement
  | GridFilterColumnElement
  | GridSortColumnElement
  | GridTreeColumnElement
  | GridColumnGroupElement;

type GridContext = {
  onColumnAdded(column: AnyGridColumnElement): void;
  onColumnRemoved(column: AnyGridColumnElement): void;
  onColumnRendered(column: AnyGridColumnElement): void;
};

const GridContext = createContext<GridContext | null>(null);

export function useGridColumn(columnRef: RefObject<AnyGridColumnElement>, isRendered: boolean) {
  const gridContext = useContext(GridContext)!;

  useEffect(() => {
    gridContext.onColumnAdded(columnRef.current!);

    return () => {
      gridContext.onColumnRemoved(columnRef.current!);
    };
  }, []);

  useEffect(() => {
    if (isRendered) {
      gridContext.onColumnRendered(columnRef.current!);
    }
  }, [isRendered]);
}

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  const innerRef = useRef<GridElement>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  const columnsRef = useRef<Set<AnyGridColumnElement>>(new Set());
  const [renderedColumns, setRenderedColumns] = useState<Set<AnyGridColumnElement>>(new Set());
  const [isColumnsWidthRecalculationPending, setColumnsWidthRecalculationPending] = useState(true);

  const onColumnAdded = useCallback((column: AnyGridColumnElement) => {
    columnsRef.current.add(column);
  }, []);

  const onColumnRemoved = useCallback((column: AnyGridColumnElement) => {
    columnsRef.current.delete(column);

    setRenderedColumns((columns) => {
      columns.delete(column);
      return new Set(columns);
    });
  }, []);

  const onColumnRendered = useCallback((column: AnyGridColumnElement) => {
    setRenderedColumns((columns) => {
      columns.add(column);
      return new Set(columns);
    });
  }, []);

  useEffect(() => {
    if (!isColumnsWidthRecalculationPending || columnsRef.current.size === 0) {
      return;
    }

    if ([...columnsRef.current].every((col) => col.hidden || renderedColumns.has(col))) {
      innerRef.current!.recalculateColumnWidths();
      setColumnsWidthRecalculationPending(false);
    }
  }, [renderedColumns, isColumnsWidthRecalculationPending]);

  return (
    <GridContext.Provider value={{ onColumnAdded, onColumnRemoved, onColumnRendered }}>
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

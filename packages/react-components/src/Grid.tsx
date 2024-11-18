import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type RefAttributes,
  useEffect,
  useLayoutEffect,
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

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer);

  const innerRef = useRef<GridElement & { _recalculateColumnWidths?(...args: any[]): void }>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  const [pendingRecalculateColumnWidthsCall, setPendingRecalculateColumnWidthsCall] = useState<any[] | null>(null);

  useLayoutEffect(() => {
    innerRef.current!._recalculateColumnWidths = function (...args) {
      setPendingRecalculateColumnWidthsCall(args);
    };
  }, []);

  useEffect(() => {
    if (pendingRecalculateColumnWidthsCall) {
      const gridElement = innerRef.current!;
      const gridProto = Object.getPrototypeOf(gridElement);
      gridProto._recalculateColumnWidths.call(gridElement, ...pendingRecalculateColumnWidthsCall);
      setPendingRecalculateColumnWidthsCall(null);
    }
  }, [pendingRecalculateColumnWidthsCall]);

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

import {
  type ComponentType,
  createContext,
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

export * from './generated/Grid.js';

export type GridProps<TItem> = Partial<Omit<_GridProps<TItem>, 'rowDetailsRenderer'>> &
  Readonly<{
    rowDetailsRenderer?: ComponentType<GridRowDetailsReactRendererProps<TItem>> | null;
  }>;

type GridContext<TItem = GridDefaultItem> = {
  gridRef: RefObject<GridElement<TItem>>;
};

export const GridContext = createContext<GridContext | null>(null);

function Grid<TItem = GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridElement<TItem>>,
): ReactElement | null {
  const [portals, rowDetailsRenderer] = useModelRenderer(props.rowDetailsRenderer, { renderSync: true });

  const innerRef = useRef<GridElement>(null);
  const finalRef = useMergedRefs(innerRef, ref);

  return (
    <GridContext.Provider
      value={{
        gridRef: innerRef,
      }}
    >
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

// customElements.whenDefined('vaadin-grid').then(() => {
//   const gridProto = customElements.get('vaadin-grid')?.prototype;
//   const originalRecalculateColumnWidths = gridProto?._recalculateColumnWidths;
//   gridProto._recalculateColumnWidths = function (...args: any[]) {
//     // Multiple synchronous calls to the renderers using flushSync cause
//     // some of the renderers to be called asynchronously (see useRenderer.ts).
//     // To make sure all the column cell content is rendered before recalculating
//     // the column widths, we need to make _recalculateColumnWidths asynchronous.
//     queueMicrotask(() => originalRecalculateColumnWidths.call(this, ...args));
//   };
// });

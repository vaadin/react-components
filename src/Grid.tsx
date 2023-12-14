import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  Grid as _Grid,
  type GridDefaultItem,
  type GridElement,
  type GridProps as _GridProps,
} from './generated/Grid.js';
import type { GridRowDetailsReactRendererProps } from './renderers/grid.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

// "@vaadin/grid/vaadin-grid.js" has additional re-exports from "grid-column.js"
// for historical reasons. This exports "GridColumn" web component, which gets
// suggested in React context, see https://github.com/vaadin/react-components/issues/68
// Fix: use re-exports from raw "src/vaadin-grid.js" as a workaround, until
// the re-export is removed.
export * from '@vaadin/grid/src/vaadin-grid.js';
export { GridElement, type GridEventMap } from './generated/Grid.js';

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

const gridProto = customElements.get('vaadin-grid')?.prototype;
const recalculateColumnWidths: (cols: HTMLElement[]) => void = gridProto._recalculateColumnWidths;
// Patch the method to recalculate column widths after React renders custom cell content.
gridProto._recalculateColumnWidths = function (cols: HTMLElement[]) {
  const container: HTMLDivElement = this.$.scroller;
  // Hide the content visually to avoid flickering.
  container.style.visibility = 'hidden';

  // Call the original method synchronously once to not change the default behavior.
  recalculateColumnWidths.call(this, cols);

  // To make the timing for both Safari and Firefox work, we need to wait for
  // a frame and a timeout.
  requestAnimationFrame(() => {
    setTimeout(() => {
      // React renders custom cell content asynchronously, so we need to wait
      // and recalculate column widths again.
      recalculateColumnWidths.call(this, cols);
      // Unhide the content.
      container.style.visibility = '';
    });
  });
};

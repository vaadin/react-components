import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Grid as _Grid, GridModule, type GridProps as _GridProps } from './generated/Grid.js';
import type { GridRowDetailsReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from './renderers/modelRenderer.js';

export type GridProps<TItem> = Omit<_GridProps<TItem>, 'rowDetailsRenderer'> &
  Readonly<{
    rowDetailsRenderer?: GridRowDetailsReactRenderer<TItem> | null;
  }>;

function Grid<TItem = GridModule.GridDefaultItem>(
  props: GridProps<TItem>,
  ref: ForwardedRef<GridModule.Grid<TItem>>,
): ReactElement | null {
  return (
    <_Grid<TItem>
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      rowDetailsRenderer={
        props.rowDetailsRenderer &&
        (createModelRenderer(props.rowDetailsRenderer) as GridModule.GridRowDetailsRenderer<TItem>)
      }
    />
  );
}

const ForwardedGrid = forwardRef(Grid) as <TItem = GridModule.GridDefaultItem>(
  props: GridProps<TItem> & { ref?: ForwardedRef<GridModule.Grid<TItem>> },
) => ReactElement | null;

export { ForwardedGrid as Grid, GridModule };

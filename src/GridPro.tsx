import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import type { GridModule } from './generated/Grid.js';
import { GridPro as _GridPro, GridProModule, type GridProProps as _GridProProps } from './generated/GridPro.js';
import type { GridRowDetailsReactRenderer } from './renderers/grid.js';
import { createModelRenderer } from './renderers/modelRenderer.js';

export type GridProProps<TItem> = Omit<_GridProProps<TItem>, 'rowDetailsRenderer'> &
  Readonly<{
    rowDetailsRenderer?: GridRowDetailsReactRenderer<TItem> | null;
  }>;

function GridPro<TItem = GridModule.GridDefaultItem>(
  props: GridProProps<TItem>,
  ref: ForwardedRef<GridProModule.GridPro<TItem>>,
): ReactElement | null {
  return (
    <_GridPro<TItem>
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

const ForwardedGridPro = forwardRef(GridPro) as <TItem = GridModule.GridDefaultItem>(
  props: GridProProps<TItem> & { ref?: ForwardedRef<GridProModule.GridPro<TItem>> },
) => ReactElement | null;

export { ForwardedGridPro as GridPro, GridProModule };

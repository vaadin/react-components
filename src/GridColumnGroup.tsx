import {
  forwardRef,
  type ComponentType,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import {
  GridColumnGroup as _GridColumnGroup,
  type GridColumnGroupElement,
  type GridColumnGroupProps as _GridColumnGroupProps,
} from './generated/GridColumnGroup.js';
import { type ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { OmittedGridColumnHTMLAttributes } from './GridColumn.js';

export * from './generated/GridColumnGroup.js';

export type GridColumnGroupProps = Partial<
  Omit<
    _GridColumnGroupProps,
    'footerRenderer' | 'header' | 'headerRenderer' | keyof OmittedGridColumnHTMLAttributes<any>
  >
> &
  Readonly<{
    footer?: ReactNode;
    footerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
    header?: ReactNode;
    headerRenderer?: ComponentType<ReactSimpleRendererProps<GridColumnGroupElement>> | null;
  }>;

function GridColumnGroup(
  { children, footer, header, ...props }: GridColumnGroupProps,
  ref: ForwardedRef<GridColumnGroupElement>,
): ReactElement | null {
  const [headerPortals, headerRenderer] = useSimpleOrChildrenRenderer(props.headerRenderer, header, {
    renderSync: true,
  });
  const [footerPortals, footerRenderer] = useSimpleOrChildrenRenderer(props.footerRenderer, footer, {
    renderSync: true,
  });

  return (
    <_GridColumnGroup {...props} footerRenderer={footerRenderer} headerRenderer={headerRenderer} ref={ref}>
      {headerPortals}
      {footerPortals}
      {children}
    </_GridColumnGroup>
  );
}

function withDefine<T extends typeof GridColumnGroup>(component: T): T & { define: () => Promise<void> } {
  Object.assign(component, { define: _GridColumnGroup.define });
  return component as T & { define: () => Promise<void> };
}

const ForwardedGridColumnGroup = forwardRef(GridColumnGroup) as (
  props: GridColumnGroupProps & RefAttributes<GridColumnGroupElement>,
) => ReactElement | null;

const GridColumnGroupWithDefine = withDefine(ForwardedGridColumnGroup);

export { GridColumnGroupWithDefine as GridColumnGroup };

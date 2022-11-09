import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ContextMenu as _ContextMenu,
  ContextMenuModule,
  type ContextMenuProps as _ContextMenuProps,
} from './generated/ContextMenu.js';
import { type ReactContextRendererProps, useContextRenderer } from './renderers/useContextRenderer.js';

export type ContextMenuReactRendererProps = ReactContextRendererProps<
  ContextMenuModule.ContextMenuRendererContext,
  ContextMenuModule.ContextMenu
>;

export type ContextMenuProps = Omit<_ContextMenuProps, 'renderer'> &
  Readonly<{
    children?: ComponentType<ContextMenuReactRendererProps> | null;
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;
  }>;

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<ContextMenuModule.ContextMenu>): ReactElement | null {
  const [portals, renderer] = useContextRenderer(props.renderer ?? props.children);

  return (
    <_ContextMenu {...props} ref={ref} renderer={renderer}>
      {portals}
    </_ContextMenu>
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu, ContextMenuModule };

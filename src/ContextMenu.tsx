import { ComponentType, type ForwardedRef, forwardRef, PropsWithChildren, type ReactElement } from 'react';
import {
  ContextMenu as _ContextMenu,
  WebComponentModule,
  type ContextMenuProps as _ContextMenuProps,
} from './generated/ContextMenu.js';
import { type ReactContextRendererProps, useContextRenderer } from './renderers/useContextRenderer.js';

export type ContextMenuReactRendererProps = ReactContextRendererProps<
  WebComponentModule.ContextMenuRendererContext,
  WebComponentModule.ContextMenu
>;

export type ContextMenuProps = Omit<_ContextMenuProps, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;
  }>;

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<WebComponentModule.ContextMenu>): ReactElement | null {
  const [portals, renderer] = useContextRenderer(props.renderer);

  return (
    <_ContextMenu {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ContextMenu>
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu, WebComponentModule };

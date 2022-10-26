import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ContextMenu as _ContextMenu,
  ContextMenuModule,
  type ContextMenuProps as _ContextMenuProps,
} from './generated/ContextMenu.js';
import { createSimpleRenderer, type ReactSimpleRenderer } from './renderers/simpleRenderer.js';

export type ContextMenuReactRenderer = ReactSimpleRenderer<ContextMenuModule.ContextMenu>;

export type ContextMenuProps = Omit<_ContextMenuProps, 'renderer'> &
  Readonly<{
    renderer?: ContextMenuReactRenderer | null;
  }>;

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<ContextMenuModule.ContextMenu>): ReactElement | null {
  return (
    <_ContextMenu
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      renderer={props.renderer && (createSimpleRenderer(props.renderer) as ContextMenuModule.ContextMenuRenderer)}
    />
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu, ContextMenuModule };

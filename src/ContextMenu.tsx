import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from 'react';
import {
  ContextMenu as _ContextMenu,
  type ContextMenuRendererContext,
  type ContextMenuElement,
  type ContextMenuProps as _ContextMenuProps,
  type ContextMenuItem as _ContextMenuItem,
} from './generated/ContextMenu.js';
import { type ReactContextRendererProps, useContextRenderer } from './renderers/useContextRenderer.js';
import { createPortal } from 'react-dom';

export * from './generated/ContextMenu.js';

export type ContextMenuReactRendererProps = ReactContextRendererProps<ContextMenuRendererContext, ContextMenuElement>;

export type ContextMenuItem = Omit<_ContextMenuItem, 'component' | 'children'> & {
  component?: ReactNode | string;

  children?: ContextMenuItem[];
};

// The 'opened' property is omitted because it is readonly in the web component.
// So you cannot set it up manually, only read from the component.
// For changing the property, use specific methods of the component.
export type ContextMenuProps = Partial<Omit<_ContextMenuProps, 'opened' | 'renderer' | 'items'>> &
  Readonly<{
    renderer?: ComponentType<ContextMenuReactRendererProps> | null;

    items?: ContextMenuItem[];
  }>;

// TODO: Move to utils / renderers and make it generic / reusable for other components with items API.
function useItemsWithComponents(items?: ContextMenuItem[]): [ReactPortal[], _ContextMenuItem[] | undefined] {
  const itemPortals: ReactPortal[] = [];

  const webComponentItems = items?.map((item) => {
    const { component, children, ...rest } = item;
    let root: HTMLElement | undefined;

    if (component && typeof component !== 'string') {
      root = document.createElement('div');
      itemPortals.push(createPortal(component, root));
    }

    const [childPortals, webComponentChildren] = useItemsWithComponents(children);
    itemPortals.push(...childPortals);

    return {
      ...rest,
      component: typeof component === 'string' ? component : root,
      children: webComponentChildren,
    };
  });

  return [itemPortals, webComponentItems];
}

function ContextMenu(props: ContextMenuProps, ref: ForwardedRef<ContextMenuElement>): ReactElement | null {
  const [portals, renderer] = useContextRenderer(props.renderer);
  const [itemPortals, webComponentItems] = useItemsWithComponents(props.items);

  return (
    <_ContextMenu {...props} ref={ref} renderer={renderer} items={webComponentItems}>
      {props.children}
      {portals}
      {itemPortals}
    </_ContextMenu>
  );
}

const ForwardedContextMenu = forwardRef(ContextMenu);

export { ForwardedContextMenu as ContextMenu };

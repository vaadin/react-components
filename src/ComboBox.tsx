import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, forwardRef, type ReactElement, type RefAttributes, type ForwardedRef } from 'react';
import {
  ComboBox as _ComboBox,
  type ComboBoxElement,
  type ComboBoxProps as _ComboBoxProps,
} from './generated/ComboBox.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/ComboBox.js';

export type ComboBoxProps<TItem> = Partial<Omit<_ComboBoxProps<TItem>, 'renderer'>> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBox<TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem>,
  ref: ForwardedRef<ComboBoxElement<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_ComboBox<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ComboBox>
  );
}

function withDefine<T extends typeof ComboBox>(component: T): T & { define: () => Promise<void> } {
  Object.assign(component, { define: _ComboBox.define });
  return component as T & { define: () => Promise<void> };
}

const ForwardedComboBox = forwardRef(ComboBox) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem> & RefAttributes<ComboBoxElement<TItem>>,
) => ReactElement | null;

const ComboBoxWithDefine = withDefine(ForwardedComboBox);

export { ComboBoxWithDefine as ComboBox };

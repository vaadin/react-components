import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, forwardRef, type ReactElement, type RefAttributes, type ForwardedRef } from 'react';
import {
  ComboBoxLight as _ComboBoxLight,
  type ComboBoxLightElement,
  type ComboBoxLightProps as _ComboBoxLightProps,
} from './generated/ComboBoxLight.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/ComboBoxLight.js';

export type ComboBoxLightProps<TItem> = Partial<Omit<_ComboBoxLightProps<TItem>, 'renderer'>> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBoxLight<TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem>,
  ref: ForwardedRef<ComboBoxLightElement<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_ComboBoxLight<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ComboBoxLight>
  );
}

function withDefine<T extends typeof ComboBoxLight>(component: T): T & { define: () => Promise<void> } {
  Object.assign(component, { define: _ComboBoxLight.define });
  return component as T & { define: () => Promise<void> };
}

const ForwardedComboBoxLight = forwardRef(ComboBoxLight) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem> & RefAttributes<ComboBoxLightElement<TItem>>,
) => ReactElement | null;

const ComboBoxLightWithDefine = withDefine(ForwardedComboBoxLight);

export { ComboBoxLightWithDefine as ComboBoxLight };

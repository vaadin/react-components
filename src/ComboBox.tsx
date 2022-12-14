import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ComboBox as _ComboBox,
  type ComboBoxProps as _ComboBoxProps,
  WebComponentModule,
} from './generated/ComboBox.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/ComboBox.js';

export type ComboBoxProps<TItem> = Omit<_ComboBoxProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBox<TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem>,
  ref: ForwardedRef<WebComponentModule.ComboBox<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer);

  return (
    <_ComboBox<TItem> {...props} ref={ref} renderer={renderer}>
      {props.children}
      {portals}
    </_ComboBox>
  );
}

const ForwardedComboBox = forwardRef(ComboBox) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem> & { ref?: ForwardedRef<WebComponentModule.ComboBox<TItem>> },
) => ReactElement | null;

export { ForwardedComboBox as ComboBox, WebComponentModule };

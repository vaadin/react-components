import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { ComboBox as _ComboBox, type ComboBoxProps as _ComboBoxProps, ComboBoxModule } from './generated/ComboBox.js';
import type { ComboBoxReactRenderer } from "./renderers/combobox.js";
import { createModelRenderer } from './renderers/modelRenderer.js';

export type ComboBoxProps<TItem> = Omit<_ComboBoxProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComboBoxReactRenderer<TItem> | null;
  }>;

function ComboBox<TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem>,
  ref: ForwardedRef<ComboBoxModule.ComboBox<TItem>>,
): ReactElement | null {
  return <_ComboBox<TItem> {...props} ref={ref} renderer={props.renderer && createModelRenderer(props.renderer)} />;
}

const ForwardedComboBox = forwardRef(ComboBox) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxProps<TItem> & { ref?: ForwardedRef<ComboBoxModule.ComboBox<TItem>> },
) => ReactElement | null;

export { ForwardedComboBox as ComboBox, ComboBoxModule };

import type { ComboBoxDefaultItem } from "@vaadin/combo-box";
import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ComboBoxLight as _ComboBoxLight,
  ComboBoxLightModule,
  type ComboBoxLightProps as _ComboBoxLightProps
} from "./generated/ComboBoxLight.js";
import type { ComboBoxReactRenderer } from "./renderers/combobox.js";
import { createModelRenderer } from './renderers/modelRenderer.js';

export type ComboBoxLightProps<TItem> = Omit<_ComboBoxLightProps<TItem>, 'renderer'> &
  Readonly<{
    renderer?: ComboBoxReactRenderer<TItem> | null;
  }>;

function ComboBoxLight<TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem>,
  ref: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>>,
): ReactElement | null {
  return <_ComboBoxLight<TItem> {...props} ref={ref} renderer={props.renderer && createModelRenderer(props.renderer)} />;
}

const ForwardedComboBoxLight = forwardRef(ComboBoxLight) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem> & { ref?: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>> },
) => ReactElement | null;

export { ForwardedComboBoxLight as ComboBoxLight, ComboBoxLightModule };

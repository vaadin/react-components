import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  ComboBoxLight as _ComboBoxLight,
  ComboBoxLightModule,
  type ComboBoxLightProps as _ComboBoxLightProps,
} from './generated/ComboBoxLight.js';
import type { ComboBoxReactRendererProps } from './renderers/combobox.js';
import { useModelRenderer } from './renderers/useModelRenderer.js';

export type ComboBoxLightProps<TItem> = Omit<_ComboBoxLightProps<TItem>, 'renderer'> &
  Readonly<{
    children?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
    renderer?: ComponentType<ComboBoxReactRendererProps<TItem>> | null;
  }>;

function ComboBoxLight<TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem>,
  ref: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>>,
): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_ComboBoxLight<TItem> {...props} ref={ref} renderer={renderer}>
      {portals}
    </_ComboBoxLight>
  );
}

const ForwardedComboBoxLight = forwardRef(ComboBoxLight) as <TItem = ComboBoxDefaultItem>(
  props: ComboBoxLightProps<TItem> & { ref?: ForwardedRef<ComboBoxLightModule.ComboBoxLight<TItem>> },
) => ReactElement | null;

export { ForwardedComboBoxLight as ComboBoxLight, ComboBoxLightModule };

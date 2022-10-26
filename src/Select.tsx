import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Select as _Select,
  SelectModule,
  type SelectProps as _SelectProps,
} from './generated/Select.js';
import { createSimpleRenderer, type ReactSimpleRenderer } from "./renderers/simpleRenderer.js";

export type SelectReactRenderer = ReactSimpleRenderer<SelectModule.Select>;

export type SelectProps = Omit<_SelectProps, 'renderer'> &
  Readonly<{
    renderer?: SelectReactRenderer;
  }>;

function Select(
  props: SelectProps,
  ref: ForwardedRef<SelectModule.Select>,
): ReactElement | null {
  return (
    <_Select
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      renderer={props.renderer && (createSimpleRenderer(props.renderer) as SelectModule.SelectRenderer)}
    />
  );
}

const ForwardedSelect = forwardRef(Select);

export { ForwardedSelect as Select, SelectModule };

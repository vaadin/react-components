import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Checkbox as _Checkbox, CheckboxModule, type CheckboxProps as _CheckboxProps } from './generated/Checkbox.js';

export type CheckboxProps = Omit<_CheckboxProps, 'children'> &
  Readonly<{
    children?: _CheckboxProps['label'];
  }>;

function Checkbox(props: CheckboxProps, ref: ForwardedRef<CheckboxModule.Checkbox>): ReactElement | null {
  return <_Checkbox {...props} ref={ref} label={props.label ?? props.children} />;
}

const ForwardedCheckbox = forwardRef(Checkbox);

export { ForwardedCheckbox as Checkbox, CheckboxModule };

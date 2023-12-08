import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  TimePicker as _TimePicker,
  type TimePickerElement,
  type TimePickerProps as _TimePickerProps,
} from './generated/TimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/TimePicker.js';

type KeysStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never;

type TimePickerProps = Omit<_TimePickerProps, KeysStartingWith<keyof _TimePickerProps, '_'>>;

const ForwardedTimePicker = forwardRef(
  createComponentWithOrderedProps<TimePickerProps, TimePickerElement>(_TimePicker, 'value'),
) as (props: TimePickerProps & RefAttributes<TimePickerElement>) => ReactElement | null;

export { ForwardedTimePicker as TimePicker };

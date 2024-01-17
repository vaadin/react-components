import { type ForwardRefExoticComponent, forwardRef, type RefAttributes } from 'react';
import { TimePicker as _TimePicker, type TimePickerElement, type TimePickerProps } from './generated/TimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/TimePicker.js';

const ForwardedTimePicker = forwardRef(
  createComponentWithOrderedProps<TimePickerProps, TimePickerElement>(_TimePicker, 'value'),
) as ForwardRefExoticComponent<TimePickerProps & RefAttributes<TimePickerElement>> & {
  define(): Promise<void>;
};

Object.assign(ForwardedTimePicker, { define: _TimePicker.define });

export { ForwardedTimePicker as TimePicker };

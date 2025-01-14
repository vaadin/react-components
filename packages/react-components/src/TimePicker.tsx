import { forwardRef, type ForwardRefExoticComponent, type ReactElement, type RefAttributes } from 'react';
import { TimePicker as _TimePicker, type TimePickerElement, type TimePickerProps } from './generated/TimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/TimePicker.js';

export const TimePicker = forwardRef(
  createComponentWithOrderedProps<TimePickerProps, TimePickerElement>(_TimePicker, 'value'),
) as ForwardRefExoticComponent<TimePickerProps & RefAttributes<TimePickerElement>>;

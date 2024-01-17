import { type ForwardRefExoticComponent, forwardRef, type RefAttributes } from 'react';
import {
  DateTimePicker as _DateTimePicker,
  type DateTimePickerElement,
  type DateTimePickerProps,
} from './generated/DateTimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/DateTimePicker.js';

const ForwardedDateTimePicker = forwardRef(
  createComponentWithOrderedProps<DateTimePickerProps, DateTimePickerElement>(_DateTimePicker, 'value'),
) as ForwardRefExoticComponent<DateTimePickerProps & RefAttributes<DateTimePickerElement>> & {
  define(): Promise<void>;
};

Object.assign(ForwardedDateTimePicker, { define: _DateTimePicker.define });

export { ForwardedDateTimePicker as DateTimePicker };

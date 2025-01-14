import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import {
  DateTimePicker as _DateTimePicker,
  type DateTimePickerElement,
  type DateTimePickerProps,
} from './generated/DateTimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/DateTimePicker.js';

export const DateTimePicker = forwardRef(
  createComponentWithOrderedProps<DateTimePickerProps, DateTimePickerElement>(_DateTimePicker, 'value'),
) as ForwardRefExoticComponent<DateTimePickerProps & RefAttributes<DateTimePickerElement>>;

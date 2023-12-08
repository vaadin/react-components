import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  DateTimePicker as _DateTimePicker,
  type DateTimePickerElement,
  type DateTimePickerProps as _DateTimePickerProps,
} from './generated/DateTimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/DateTimePicker.js';

type KeysStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never;

type DateTimePickerProps = Omit<_DateTimePickerProps, KeysStartingWith<keyof _DateTimePickerProps, '_'>>;

const ForwardedDateTimePicker = forwardRef(
  createComponentWithOrderedProps<DateTimePickerProps, DateTimePickerElement>(_DateTimePicker, 'value'),
) as (props: DateTimePickerProps & RefAttributes<DateTimePickerElement>) => ReactElement | null;

export { ForwardedDateTimePicker as DateTimePicker };

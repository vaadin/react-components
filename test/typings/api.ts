import React, { type ComponentType, type DOMAttributes, type HTMLAttributes, type RefAttributes } from 'react';
import { TextField, TextFieldElement } from '../../TextField.js';
import type { LitElement } from 'lit';
import { GridColumn, GridColumnElement } from '../../GridColumn.js';
import { GridTreeColumn } from '../../GridTreeColumn.js';
import { GridSortColumn } from '../../GridSortColumn.js';
import { GridFilterColumn } from '../../GridFilterColumn.js';
import { GridSelectionColumn } from '../../GridSelectionColumn.js';
import { GridProEditColumn } from '../../GridProEditColumn.js';
import { GridColumnGroup, GridColumnGroupElement } from '../../GridColumnGroup.js';
import { Dialog, DialogElement } from '../../Dialog.js';
import { DatePicker, DatePickerElement } from '../../DatePicker.js';
import { LoginOverlay, LoginOverlayElement } from '../../LoginOverlay.js';
import { TimePicker, type TimePickerChangeEvent } from '../../TimePicker.js';
import { TextArea, TextAreaElement, type TextAreaChangeEvent } from '../../TextArea.js';
import { MessageInput, MessageInputElement, type MessageInputSubmitEvent } from '../../MessageInput.js';
import { ComboBox, type ComboBoxChangeEvent } from '../../ComboBox.js';

const assertType = <TExpected>(value: TExpected) => value;
const assertOmitted = <C, T>(prop: keyof Omit<C, keyof T>) => prop;

const textFieldProps = React.createElement(TextField, {}).props;
type TextFieldProps = typeof textFieldProps;

type PartialTextFieldElement = Omit<
  Partial<TextFieldElement>,
  'draggable' | 'style' | 'translate' | 'children' | 'contentEditable'
>;

assertType<PartialTextFieldElement>(textFieldProps);

// Assert that certain properties are present
assertType<PartialTextFieldElement['label']>(textFieldProps.label);
assertType<PartialTextFieldElement['value']>(textFieldProps.value);
assertType<PartialTextFieldElement['hidden']>(textFieldProps.hidden);
assertType<PartialTextFieldElement['slot']>(textFieldProps.slot);
assertType<PartialTextFieldElement['title']>(textFieldProps.title);
assertType<PartialTextFieldElement['id']>(textFieldProps.id);

assertType<HTMLAttributes<TextFieldElement>['className']>(textFieldProps.className);
assertType<HTMLAttributes<TextFieldElement>['style']>(textFieldProps.style);
assertType<HTMLAttributes<TextFieldElement>['children']>(textFieldProps.children);
assertType<HTMLAttributes<TextFieldElement>['aria-label']>(textFieldProps['aria-label']);

assertType<RefAttributes<TextFieldElement>['ref']>(textFieldProps.ref);

// Assert that certain HTMLElement properties are NOT present
assertOmitted<HTMLElement, TextFieldProps>('append');
assertOmitted<HTMLElement, TextFieldProps>('prepend');
assertOmitted<HTMLElement, TextFieldProps>('ariaLabel');

// Assert that certain LitElement properties are NOT present
assertOmitted<LitElement, TextFieldProps>('renderRoot');
assertOmitted<LitElement, TextFieldProps>('requestUpdate');
assertOmitted<LitElement, TextFieldProps>('addController');
assertOmitted<LitElement, TextFieldProps>('removeController');

const gridColumnProps = React.createElement(GridColumn, {}).props;
type GridColumnProps = typeof gridColumnProps;
assertType<GridColumnElement['hidden'] | undefined>(gridColumnProps.hidden);
assertType<GridColumnElement['autoWidth'] | undefined>(gridColumnProps.autoWidth);
assertType<HTMLAttributes<GridColumnElement>['id']>(gridColumnProps.id);
assertType<RefAttributes<GridColumnElement>['ref']>(gridColumnProps.ref);
assertType<HTMLAttributes<GridColumnElement>['className']>(gridColumnProps.className);
assertType<HTMLAttributes<GridColumnElement>['dangerouslySetInnerHTML']>(gridColumnProps.dangerouslySetInnerHTML);
assertType<HTMLAttributes<GridColumnElement>['slot']>(gridColumnProps.slot);
assertType<ComponentType<Readonly<any>> | undefined | null>(gridColumnProps.children);

// Some omitted HTMLElement properties
assertOmitted<HTMLElement, GridColumnProps>('append');
assertOmitted<HTMLElement, GridColumnProps>('prepend');
assertOmitted<HTMLElement, GridColumnProps>('ariaLabel');

const gridColumnGroupProps = React.createElement(GridColumnGroup, {}).props;

assertType<DOMAttributes<GridColumnGroupElement>['children'] | undefined>(gridColumnGroupProps.children);

assertOmitted<GridColumnProps, GridColumnGroupElement>('renderer');

const gridTreeColumnProps = React.createElement(GridTreeColumn, {}).props;

assertType<string | null | undefined>(gridTreeColumnProps.path);

const gridSortColumnProps = React.createElement(GridSortColumn, {}).props;
const gridFilterColumnProps = React.createElement(GridFilterColumn, {}).props;
const gridSelectionColumnProps = React.createElement(GridSelectionColumn, {}).props;
const gridProEditColumnProps = React.createElement(GridProEditColumn, {}).props;

type AllColumnsProps = typeof gridColumnGroupProps &
  typeof gridColumnProps &
  typeof gridTreeColumnProps &
  typeof gridSortColumnProps &
  typeof gridFilterColumnProps &
  typeof gridSelectionColumnProps &
  typeof gridProEditColumnProps;

// Some omitted HTMLAttributes properties
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('style');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('aria-label');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('contentEditable');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('translate');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('draggable');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('role');
assertOmitted<HTMLAttributes<GridColumnElement>, AllColumnsProps>('onClick');

const dialogProps = React.createElement(Dialog, {}).props;
type DialogProps = typeof dialogProps;

assertType<DialogElement['ariaLabel'] | undefined>(dialogProps['aria-label']);

assertType<DialogProps['footer']>(dialogProps.footer);

const datePickerProps = React.createElement(DatePicker, {}).props;

const datePickerOnChange: typeof datePickerProps.onChange = (event) => {
  assertType<DatePickerElement['value']>(event.target.value);
};

const comboBoxProps = React.createElement(ComboBox, {}).props;

assertType<typeof comboBoxProps.onChange>((_event: ComboBoxChangeEvent<any>) => {});

const messageInputProps = React.createElement(MessageInput, {}).props;

const messageInputOnSubmit: typeof messageInputProps.onSubmit = (event) => {
  assertType<MessageInputElement['value']>(event.detail.value);
};

assertType<typeof messageInputProps.onSubmit>((_event: MessageInputSubmitEvent) => {});

const textAreaProps = React.createElement(TextArea, {}).props;

assertType<typeof textAreaProps.onChange>((_event: TextAreaChangeEvent) => {});

const textAreaOnChange: typeof textAreaProps.onChange = (event) => {
  assertType<TextAreaElement['value']>(event.target.value);
};

const timePickerProps = React.createElement(TimePicker, {}).props;

assertType<typeof timePickerProps.onChange>((_event: TimePickerChangeEvent) => {});

const loginOverlayProps = React.createElement(LoginOverlay, {}).props;

assertType<LoginOverlayElement['autofocus'] | undefined>(loginOverlayProps.autofocus);

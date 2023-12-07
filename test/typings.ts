import React, { type AriaAttributes, type CSSProperties } from 'react';
import { TextField } from '../src/TextField.js';
import type { LitElement } from 'lit';
import { GridColumn } from '../src/GridColumn.js';

const assertType = <TExpected>(value: TExpected) => value;
const assertOmitted = <C, T>(prop: keyof Omit<C, keyof T>) => prop;

const textFieldProps = React.createElement(TextField, {}).props;
type TextFieldProps = typeof textFieldProps;

// Assert that certain properties are present
assertType<string | null | undefined>(textFieldProps.label);
assertType<boolean | undefined>(textFieldProps.hidden);
assertType<CSSProperties | undefined>(textFieldProps.style);
assertType<string | undefined>(textFieldProps.className);
assertType<string | undefined>(textFieldProps.slot);
assertType<string | undefined>(textFieldProps.title);
assertType<string | undefined>(textFieldProps.id);
assertType<React.ReactNode>(textFieldProps.children);
assertType<ARIAMixin['ariaLabel'] | undefined>(textFieldProps.ariaLabel);
assertType<AriaAttributes['aria-label'] | undefined>(textFieldProps['aria-label']);

// Assert that certain HTMLElement properties are NOT present
assertOmitted<HTMLElement, TextFieldProps>('append');
assertOmitted<HTMLElement, TextFieldProps>('prepend');

// Assert that certain LitElement properties are NOT present
assertOmitted<LitElement, TextFieldProps>('renderRoot');
assertOmitted<LitElement, TextFieldProps>('requestUpdate');
assertOmitted<LitElement, TextFieldProps>('addController');
assertOmitted<LitElement, TextFieldProps>('removeController');

const gridColumnProps = React.createElement(GridColumn, {}).props;
// TODO: This should come from the GridColumn API, not from HTMLAttributes
assertType<boolean | undefined>(gridColumnProps.hidden);

import React, { type AriaAttributes, type CSSProperties } from 'react';
import { TextField } from '../src/TextField.js';
import type { LitElement } from 'lit';
import { GridColumn } from '../src/GridColumn.js';

const assertType = <TExpected>(value: TExpected) => value;

const textFieldProps = React.createElement(TextField, {}).props;

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
assertType<keyof Omit<HTMLElement, keyof typeof textFieldProps>>('append');
assertType<keyof Omit<HTMLElement, keyof typeof textFieldProps>>('prepend');

// Assert that certain LitElement properties are NOT present
assertType<keyof Omit<LitElement, keyof typeof textFieldProps>>('renderRoot');
assertType<keyof Omit<LitElement, keyof typeof textFieldProps>>('requestUpdate');
assertType<keyof Omit<LitElement, keyof typeof textFieldProps>>('addController');
assertType<keyof Omit<LitElement, keyof typeof textFieldProps>>('removeController');

const gridColumnProps = React.createElement(GridColumn, {}).props;
// TODO: This should come from the GridColumn API, not from HTMLAttributes
assertType<boolean | undefined>(gridColumnProps.hidden);

import React, { type AriaAttributes, type CSSProperties } from 'react';
import { TextField } from '../src/TextField.js';

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
type OmittedProps = Omit<HTMLElement, keyof typeof textFieldProps>
assertType<keyof Partial<OmittedProps>>('append');
assertType<keyof Partial<OmittedProps>>('prepend');
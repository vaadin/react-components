import type React from 'react';
import { Formik, Form, FastField, FieldConfig, useField, type FieldInputProps, type FieldMetaProps, type FieldProps } from 'formik';

import { Button } from '../../src/Button.js';
import { Checkbox } from '../../src/Checkbox.js';
import { CheckboxGroup } from '../../src/CheckboxGroup.js';
import { ComboBox } from '../../src/ComboBox.js';
import { ConfirmDialog } from '../../src/ConfirmDialog.js';
import { CustomField } from '../../src/CustomField.js';
import { FormItem } from '../../src/FormItem.js';
import { FormLayout } from '../../src/FormLayout.js';
import { IntegerField } from '../../src/IntegerField.js';
import { Item } from '../../src/Item.js';
import { ListBox } from '../../src/ListBox.js';
import { NumberField } from '../../src/NumberField.js';
import { PasswordField } from '../../src/PasswordField.js';
import { RadioButton } from '../../src/RadioButton.js';
import { RadioGroup } from '../../src/RadioGroup.js';
import { Select } from '../../src/Select.js';
import { TextArea } from '../../src/TextArea.js';
import { TextField } from '../../src/TextField.js';
import { fieldButton } from '@vaadin/vaadin-lumo-styles';
import type { EventNames,  } from '../../src/utils/createComponent.js';

export type VaadinFieldProps = Partial<{
  errorMessage: string | null,
  invalid: boolean,
}>;

export type FormikFieldProps<TValue = any> =  Omit<FieldConfig<TValue>, 'as' | 'component'> & {
  label?: string,
  as: FieldConfig['as'] & (
    React.ComponentType<VaadinFieldProps> |
    React.ForwardRefExoticComponent<VaadinFieldProps>
  ),
};

const FormikField = ({
  as: is,
  children,
  ...props
}: FormikFieldProps) => {
  const [field, meta] = useField(props);
  const error = meta.touched ? meta.error : undefined;
  return <FastField as={is} errorMessage={error} invalid={!!error} {...props}>{children}</FastField>;
};

function NotBlank(value: any) {
  if (value === '') {
    return 'cannot be blank';
  }
}

export default function App({}) {
  return (
    <Formik
      initialValues={{firstName: '', lastName: ''}}
      onSubmit={(values, {setSubmitting}) => {
        console.log(values);
        setSubmitting(false);
      }}>
      {({isSubmitting, values}) => (
        <Form>
          <FormLayout responsiveSteps={[{columns: 1}]}>
            <FormikField label='First name' name='firstName' as={TextField} validate={NotBlank}></FormikField>
            <FormikField label='Last name' name='lastName' as={PasswordField} validate={NotBlank}></FormikField>
            <FormikField as={ComboBox}></FormikField>
            <Button disabled={isSubmitting}>Submit</Button>
          </FormLayout>
          {JSON.stringify(values)}
        </Form>
      )}
    </Formik>
  )
};


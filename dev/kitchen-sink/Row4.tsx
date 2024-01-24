import {
  CustomField,
  DatePicker,
  DateTimePicker,
  Details,
  DetailsSummary,
  FormItem,
  FormLayout,
  IntegerField,
  NumberField,
  PasswordField,
  TextField,
  TimePicker,
} from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

export default function Row4() {
  return (
    <BoardRow>
      <CustomField label="Custom field">
        <TextField placeholder="Text"></TextField>
        <NumberField placeholder="Number"></NumberField>
        <IntegerField placeholder="Integer"></IntegerField>
        <PasswordField placeholder="Password"></PasswordField>
      </CustomField>
      <Details opened>
        <DetailsSummary slot="summary">Details</DetailsSummary>
        <p>Details content</p>
      </Details>
      <FormLayout>
        <FormItem>
          <label slot="label">Form item</label>
          <output>value</output>
        </FormItem>
        <DatePicker label="DatePicker"></DatePicker>
        <TimePicker label="TimePicker"></TimePicker>
        <DateTimePicker label="DateTimePicker"></DateTimePicker>
      </FormLayout>
    </BoardRow>
  );
}

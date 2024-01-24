import { useState } from 'react';
import { Checkbox, CheckboxGroup, ComboBox, ConfirmDialog, MultiSelectComboBox } from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

function CheckboxesWithListener() {
  const [checked, setChecked] = useState('first');

  return (
    <CheckboxGroup
      label="Checkboxes With Listener"
      value={[checked]}
      onValueChanged={({ detail: { value } }) => setChecked(value[0])}
    >
      <Checkbox value="first">First One</Checkbox>
      <Checkbox value="second">Second One</Checkbox>
      <Checkbox value="third">Third One</Checkbox>
      <Checkbox value="fourth">Fourth One</Checkbox>
    </CheckboxGroup>
  );
}

export default function Row2() {
  return (
    <BoardRow>
      <CheckboxesWithListener />
      <CheckboxGroup label="CheckboxGroup">
        <Checkbox value="accept_terms" label="Accept Terms"></Checkbox>
      </CheckboxGroup>
      <ComboBox label="ComboBox" items={['foo', 'bar']}></ComboBox>
      <MultiSelectComboBox label="MultiSelectComboBox" items={['foo', 'bar', 'baz']}></MultiSelectComboBox>
      <ConfirmDialog></ConfirmDialog>
    </BoardRow>
  );
}

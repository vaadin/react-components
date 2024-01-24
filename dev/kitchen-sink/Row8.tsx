import { Item, ListBox, RadioButton, RadioGroup, Select, Tooltip } from '@vaadin/react-components';
import { BoardRow, RichTextEditor } from '@vaadin/react-components-pro';

function SelectListBox() {
  return (
    <ListBox>
      <Item value="1">One</Item>
      <Item value="2">Two</Item>
    </ListBox>
  );
}

export default function Row8() {
  return (
    <BoardRow>
      <RadioGroup>
        <RadioButton>
          <label slot="label">One</label>
        </RadioButton>
        <RadioButton>
          <label slot="label">Two</label>
        </RadioButton>
      </RadioGroup>
      <RichTextEditor></RichTextEditor>
      <Select label="Select" value="2">
        {SelectListBox}
        <span slot="prefix">+</span>
        <Tooltip slot="tooltip" text="Select tooltip"></Tooltip>
      </Select>
    </BoardRow>
  );
}

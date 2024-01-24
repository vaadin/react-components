import { Checkbox, ComboBox, ContextMenu, FormLayout, Item, ListBox, TextField } from '@vaadin/react-components';
import { BoardRow, CookieConsent, Crud, crudPath } from '@vaadin/react-components-pro';
import { CrudRole, crudData } from './data.js';

const menuItems = [{ text: 'Edit' }, { text: 'Delete' }];

export default function Row3() {
  return (
    <BoardRow>
      <ContextMenu items={menuItems}>
        <ListBox>
          <Item>ListBox Item</Item>
        </ListBox>
      </ContextMenu>
      <CookieConsent position="bottom-right"></CookieConsent>
      <Crud items={crudData}>
        <FormLayout slot="form">
          <TextField label="Name" {...crudPath('name')} />
          <ComboBox label="Role" items={Object.values(CrudRole)} {...crudPath('role')} />
          <Checkbox label="Active" {...crudPath('active')} />
        </FormLayout>
      </Crud>
    </BoardRow>
  );
}

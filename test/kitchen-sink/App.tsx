import React from 'react';
import { Button } from "../../generated/index.js";
import { Accordion } from '../../src/Accordion';
import { AccordionPanel } from '../../src/AccordionPanel';
import { AppLayout } from '../../src/AppLayout';
import { Avatar } from '../../src/Avatar';
import { AvatarGroup } from '../../src/AvatarGroup';
import { Board } from '../../src/Board';
import { BoardRow } from '../../src/BoardRow';
import { Chart } from '../../src/Chart';
import { Checkbox } from '../../src/Checkbox';
import { CheckboxGroup } from '../../src/CheckboxGroup';
import { ComboBox } from '../../src/ComboBox';
import { ConfirmDialog } from '../../src/ConfirmDialog';
import { ContextMenu } from '../../src/ContextMenu';
import { DrawerToggle } from '../../src/DrawerToggle';
import { Item } from '../../src/Item';
import { ListBox } from '../../src/ListBox';
import { Tab } from '../../src/Tab';
import { Tabs } from '../../src/Tabs';

type TreeGridDataItem = {
  id: number,
  size: number,
  name: string,
  children?: TreeGridDataItem[],
}

const treeGridData: TreeGridDataItem[] = [
  {
    id: 1, size: 20, name: 'Branch 1', children: [
      { id: 2, size: 5, name: 'Leaf 1', },
      { id: 3, size: 10, name: 'Leaf 2', },
    ],
  },
  {
    id: 4, size: 15, name: 'Branch 2', children: [
      { id: 5, size: 5, name: 'Leaf 1', },
      { id: 6, size: 10, name: 'Leaf 2', },
    ]
  },
];

enum CrudRole {
  ADMIN = 'admin',
  USER = 'user',
}

type CrudDataItem = {
  name: string,
  role: CrudRole,
  active: boolean,
};

const crudData: CrudDataItem[] = [
  { name: 'Jane Doe', role: CrudRole.ADMIN, active: true, },
  { name: 'Mary Joe', role: CrudRole.USER, active: false, },
];

export default function App({}) {
  return (
    <AppLayout>
      <DrawerToggle slot='navbar'></DrawerToggle>
      <h3 slot='navbar' style={{flex: 'auto'}}>Kitchen Sink</h3>
      <Avatar slot='navbar' name='User Name' abbr='UN'></Avatar>
      <Button slot='navbar'>Hello</Button>
      <Tabs slot='drawer' orientation='vertical'>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tabs>
      <Board>
        <BoardRow>
          <Accordion>
            <AccordionPanel>
              <div slot='summary'>AccordeonPanel</div>
              <div>Accordion content 1</div>
            </AccordionPanel>
          </Accordion>
          <AvatarGroup prefix='Users: ' items={[{name: 'Jane Roe',  abbr: 'JD'}]}></AvatarGroup>
          <Chart></Chart>
        </BoardRow>
        <BoardRow>
          <CheckboxGroup label="CheckboxGroup">
            <Checkbox value='accept_terms' label="Accept Terms"></Checkbox>
          </CheckboxGroup>
          <ComboBox label='ComboBox' items={['foo', 'bar']}></ComboBox>
          <ConfirmDialog></ConfirmDialog>
        </BoardRow>
        <BoardRow>
          <ContextMenu>
            <ListBox>
              <Item>ListBox Item</Item>
            </ListBox>
          </ContextMenu>
          <CookieConsent position='bottom-right'></CookieConsent>
          <Crud items={crudData}></Crud>
        </BoardRow>
        <BoardRow>
          <CustomField label='Custom field'>
            <TextField placeholder='Text'></TextField>
            <NumberField placeholder='Number'></NumberField>
            <IntegerField placeholder='Integer'></IntegerField>
            <PasswordField placeholder='Password'></PasswordField>
          </CustomField>
          <Details opened>
            <h4 slot="summary">Details</h4>
            <p>Details content</p>
          </Details>
          <FormLayout>
            <FormItem>
              <label slot='label'>Form item</label>
              <output>value</output>
            </FormItem>
          </FormLayout>
        </BoardRow>
        <BoardRow>
          <Grid items={treeGridData}>
            <GridTreeColumn path='id' itemHasChildrenPath='children'></GridTreeColumn>
            <GridColumnGroup>
              <GridSortColumn path='size'></GridSortColumn>
              <GridFilterColumn path='name'></GridFilterColumn>
            </GridColumnGroup>
          </Grid>
          <GridPro items={crudData}>
            <GridColumn path='id'></GridColumn>
            <GridColumn path='size'></GridColumn>
            <GridProEditColumn path='name' editorType='text'></GridProEditColumn>
            <GridProEditColumn path='name' editorType='text'></GridProEditColumn>
          </GridPro>
        </BoardRow>
        <BoardRow>
          <HorizontalLayout>
            <VerticalLayout>
              <Scroller>Scroller</Scroller>
              <Iconset></Iconset>
              <Icon></Icon>
            </VerticalLayout>
            <VerticalLayout>
              <LoginForm></LoginForm>
              <LoginOverlay></LoginOverlay>
            </VerticalLayout>
          </HorizontalLayout>
          <MenuBar items={[
            {
              text: 'File',
              children: [
                { text: 'Open' },
                { text: 'Auto Save', checked: true },
              ],
            },
            { component: 'hr' },
            {
              text: 'Edit',
              children: [
                { text: 'Undo', disabled: true },
                { text: 'Redo' },
              ]
            },
            { text: 'Help' }]
          }></MenuBar>
        </BoardRow>
        <BoardRow>
          <MessageList items={[
            { text: 'Hello', time: 'today', userName: 'Bot', },
            { text: 'Message list', time: 'today', userName: 'Bot' }
          ]}></MessageList>
          <Message userName='Test User'>Message</Message>
          <MessageInput></MessageInput>
        </BoardRow>
        <BoardRow>
          <RadioGroup>
            <RadioButton><label slot='label'>One</label></RadioButton>
            <RadioButton><label slot='label'>Two</label></RadioButton>
          </RadioGroup>
          <RichTextEditor></RichTextEditor>
          <Select items={[
            {label: 'one', value: '1',},
            {label: 'two', value: '2',},
          ]}></Select>
        </BoardRow>
        <BoardRow>
          <SplitLayout>
            <TextArea label='Text Area'></TextArea>
            <Tooltip text='Tooltip'>Tooltip content</Tooltip>
          </SplitLayout>
          <Upload></Upload>
          <VirtualList></VirtualList>
        </BoardRow>
      </Board>
    </AppLayout>
  )
};


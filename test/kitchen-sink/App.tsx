import React from 'react';
import { Accordion, AccordionPanel, AppLayout, Avatar, AvatarGroup, Board, BoardRow, Button, Chart, Checkbox, CheckboxGroup, ComboBox, ConfirmDialog, ContextMenu, DrawerToggle, Item, ListBox, Tab, Tabs } from '../..';

export default function App({}) {
  return (
    <AppLayout>
      <DrawerToggle slot='navbar'></DrawerToggle>
      <h3 slot='navbar' style={{flex: 'auto'}}>Kitchen Sink</h3>
      <Avatar slot='navbar' name='User Name' abbr='UN'></Avatar>
      <Tabs slot='drawer' orientation='vertical'>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tabs>
      <Accordion>
        <AccordionPanel>
          <div slot='summary'>AccordeonPanel</div>
          <Board>
            <BoardRow>
              <div>Accordion content 1</div>
              <AvatarGroup prefix='Users: ' items={[{name: 'Jane Doe',  abbr: 'JD'}]}></AvatarGroup>
              <Chart></Chart>
            </BoardRow>
            <BoardRow>
              <CheckboxGroup label="CheckboxGroup">
                <Checkbox>Checkbox</Checkbox>
              </CheckboxGroup>
              <ComboBox label='ComboBox'></ComboBox>
              <ConfirmDialog></ConfirmDialog>
              <ContextMenu>
                <ListBox>
                  <Item>ListBox Item</Item>
                </ListBox>
              </ContextMenu>
            </BoardRow>
          </Board>
        </AccordionPanel>
      </Accordion>
    </AppLayout>
  )
};

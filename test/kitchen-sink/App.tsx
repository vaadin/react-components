import React from 'react';
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

export default function App({}) {
  return (
    <AppLayout>
      <DrawerToggle slot="navbar"></DrawerToggle>
      <h3 slot="navbar" style={{ flex: 'auto' }}>
        Kitchen Sink
      </h3>
      <Avatar slot="navbar" name="User Name" abbr="UN"></Avatar>
      <Tabs slot="drawer" orientation="vertical">
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </Tabs>
      <Accordion>
        <AccordionPanel>
          <div slot="summary">AccordeonPanel</div>
          <Board>
            <BoardRow>
              <div>Accordion content 1</div>
              <AvatarGroup prefix="Users: " items={[{ name: 'Jane Doe', abbr: 'JD' }]}></AvatarGroup>
              <Chart></Chart>
            </BoardRow>
            <BoardRow>
              <CheckboxGroup label="CheckboxGroup">
                <Checkbox>Checkbox</Checkbox>
              </CheckboxGroup>
              <ComboBox label="ComboBox"></ComboBox>
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
  );
}

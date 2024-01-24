import { Tab, Tabs, tab, TabSheet } from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

export default function Row10() {
  return (
    <BoardRow>
      <TabSheet>
        <div slot="prefix">Prefix</div>
        <div slot="suffix">Suffix</div>

        <Tabs slot="tabs">
          <Tab id="tab-1">Tab 1</Tab>
          <Tab id="tab-2">Tab 2</Tab>
          <Tab id="tab-3">Tab 3</Tab>
        </Tabs>

        <div {...tab('tab-1')}>Panel 1</div>
        {/* @ts-expect-error TS2322: "tab" is not an HTML standard attribute */}
        <div tab="tab-2">Panel 2</div>
        {/* @ts-expect-error TS2322: "tab" is not an HTML standard attribute */}
        <div tab="tab-3">Panel 3</div>
      </TabSheet>
    </BoardRow>
  );
}

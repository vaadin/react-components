import { Icon } from '../../src/Icon.js';
import { Tab } from '../../src/Tab.js';
import { TabSheet, TabSheetTab, tab } from '../../src/TabSheet.js';
import { Tabs } from '../../src/Tabs.js';
import '@vaadin/icons';

export default function () {
  return (
    <>
      New:
      <TabSheet>
        <div slot="prefix">PREFIX</div>

        <TabSheetTab label="Dashboard" aria-label="dashboard">
          <div>This is the Dashboard tab content</div>
        </TabSheetTab>

        <TabSheetTab
          label={
            <>
              <Icon icon="vaadin:user" />
              <i>Payment</i>
            </>
          }
        >
          <div>This is the Payment tab content</div>
        </TabSheetTab>

        <div slot="suffix">SUFFIX</div>
      </TabSheet>
      Old:
      <TabSheet>
        <div slot="prefix">PREFIX</div>

        <Tabs slot="tabs">
          <Tab id="dashboard-tab" aria-label="dashboard">
            Dashboard
          </Tab>
          <Tab id="payment-tab">
            <Icon icon="vaadin:user" />
            <i>Payment</i>
          </Tab>
        </Tabs>

        <div {...tab('dashboard-tab')}>This is the Dashboard tab content</div>
        <div {...tab('payment-tab')} aria-label="testing">
          This is the Payment tab content
        </div>

        <div slot="suffix">SUFFIX</div>
      </TabSheet>
    </>
  );
}

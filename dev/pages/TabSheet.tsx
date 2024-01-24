import { Icon, TabSheet, TabSheetTab } from '@vaadin/react-components';
import '@vaadin/icons';

export default function () {
  return (
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
  );
}

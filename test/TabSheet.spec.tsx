import { expect } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';

import { TabSheet, TabSheetTab, tab } from '../src/TabSheet.js';
import type { TabElement } from '../src/Tab.js';
import sinon from 'sinon';

function getTabSheet() {
  return document.querySelector('vaadin-tabsheet')!;
}

function getTabContent(tab: TabElement) {
  return getTabSheet().querySelector(`[tab="${tab.id}"]`);
}

// TODO: Remove only
describe.only('TabSheet', () => {
  afterEach(() => cleanup());

  it('should render two tabs', async () => {
    render(
      <TabSheet>
        <TabSheetTab label="Tab 1">Content 1</TabSheetTab>
        <TabSheetTab label="Tab 2">Content 2</TabSheetTab>
      </TabSheet>,
    );

    const tabs = getTabSheet().querySelectorAll('vaadin-tab');
    expect(tabs).to.have.length(2);

    expect(tabs[0]).to.have.text('Tab 1');
    expect(tabs[1]).to.have.text('Tab 2');

    expect(getTabContent(tabs[0])).to.have.text('Content 1');
    expect(getTabContent(tabs[1])).to.have.text('Content 2');
  });

  it('should render prefix and suffix', async () => {
    render(
      <TabSheet>
        <div slot="prefix">PREFIX</div>
        <TabSheetTab label="Tab 1">Content 1</TabSheetTab>
        <TabSheetTab label="Tab 2">Content 2</TabSheetTab>
        <div slot="suffix">SUFFIX</div>
      </TabSheet>,
    );

    const prefix = getTabSheet().querySelector('[slot="prefix"]');
    expect(prefix).to.have.text('PREFIX');

    const suffix = getTabSheet().querySelector('[slot="suffix"]');
    expect(suffix).to.have.text('SUFFIX');
  });

  it('should warn when using the tab helper', async () => {
    const stub = sinon.stub(console, 'warn');
    tab('Tab 1');
    expect(stub.calledOnce).to.be.true;
    stub.restore();
  });
});

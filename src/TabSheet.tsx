import React, { type ReactNode } from 'react';
import { Tab } from './Tab.js';
import { TabSheet as _TabSheet } from './generated/TabSheet.js';
import { Tabs } from './Tabs.js';

export * from './generated/TabSheet.js';

type TabSheetTabProps = React.PropsWithChildren<{
  /**
   * The content to display as the tab header in a `TabSheet`.
   */
  label?: ReactNode;
}>;

type TabSheetTab = React.ReactElement<TabSheetTabProps>;

export const TabSheetTab = (_props: TabSheetTabProps) => null;

let uniqueId = 0;
const generatedTabIds = new WeakMap<TabSheetTab, string>();
function getTabId(tab: TabSheetTab) {
  if (!generatedTabIds.has(tab)) {
    generatedTabIds.set(tab, 'tabsheet-tab-' + uniqueId++);
  }
  return generatedTabIds.get(tab);
}

export function TabSheet(props: React.PropsWithChildren<{}>) {
  const tabs = React.Children.toArray(props.children).filter((child): child is TabSheetTab => {
    return React.isValidElement(child) && child.type === TabSheetTab;
  });

  const children = React.Children.toArray(props.children).filter((child) => {
    return React.isValidElement(child) && child.type !== Tab;
  });

  return (
    <_TabSheet>
      {tabs.length > 0 ? (
        <Tabs slot="tabs">
          {tabs.map((child) => {
            const { children, label, ...rest } = child.props;
            return (
              <Tab {...rest} id={getTabId(child)} key={getTabId(child)}>
                {child.props.label}
              </Tab>
            );
          })}
        </Tabs>
      ) : null}

      {tabs.map((child) => (
        <div {...{ tab: getTabId(child) }} key={getTabId(child)}>
          {child.props.children}
        </div>
      ))}

      {children}
    </_TabSheet>
  );
}

/**
 * A helper function that allows declaring the tab identifier on the children
 * of the `<TabSheet/>` component
 *
 * ### Usage
 *
 * ```tsx
 * <TabSheet>
 *   <Tabs slot="tabs">
 *     <Tab id="about">About</Tab>
 *     <Tab id="contuct">Contact us</Tab>
 *   </Tabs>
 *   <div {...tab('about')}>This tab is all about,..</div>
 *   <div {...tab('contact')}>Our website: ...</div>
 * </TabSheet>
 * ```
 *
 * @param tab The identifier of the correspoding tab.
 *
 * @returns object with HTML attribute values recognized on tab sheet children.
 */
export function tab(tab: string): Record<string, string> {
  console.warn('Using the `tab` helper function is deprecated.');
  return { tab } as Record<string, string>;
}

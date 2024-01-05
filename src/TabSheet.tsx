import React, { forwardRef, type ForwardedRef, type HTMLAttributes, type ReactNode } from 'react';
import { Tab, type TabElement } from './Tab.js';
import {
  TabSheet as _TabSheet,
  type TabSheetElement,
  type TabSheetProps as _TabSheetProps,
} from './generated/TabSheet.js';
import { Tabs } from './Tabs.js';

export * from './generated/TabSheet.js';

type TabSheetTabProps = React.PropsWithChildren<{
  /**
   * The label of the tab.
   */
  label?: ReactNode;
}> &
  HTMLAttributes<TabElement>;

type TabSheetTab = React.ReactElement<TabSheetTabProps>;

export const TabSheetTab = (_props: TabSheetTabProps) => null;

let uniqueId = 0;
const generatedTabIds = new WeakMap<TabSheetTab, string>();
function getTabId(tab: TabSheetTab) {
  if (tab.props.id) {
    // Support custom id for a tabsheet tab
    return tab.props.id;
  }

  if (!generatedTabIds.has(tab)) {
    // Generate a temporary id for the tab while it's being rendered
    generatedTabIds.set(tab, 'tabsheet-tab-' + uniqueId++);
  }
  return generatedTabIds.get(tab);
}

export type TabSheetProps = Partial<Omit<_TabSheetProps, 'items'>>;

function TabSheet(props: TabSheetProps, ref: ForwardedRef<TabSheetElement>) {
  const { children, ...tabSheetRest } = props;

  // The direct TabSheetTab children of the TabSheet
  const tabs = React.Children.toArray(children).filter((child): child is TabSheetTab => {
    return React.isValidElement(child) && child.type === TabSheetTab;
  });

  // All the other children of the TabSheet
  const remainingChildren = React.Children.toArray(children).filter((child) => {
    return React.isValidElement(child) && child.type !== TabSheetTab;
  });

  return (
    <_TabSheet {...tabSheetRest} ref={ref}>
      {tabs.length > 0 ? (
        <Tabs slot="tabs">
          {tabs.map((child) => {
            const { children, label, ...tabRest } = child.props;
            return (
              <Tab {...tabRest} id={getTabId(child)} key={getTabId(child)}>
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

      {remainingChildren}
    </_TabSheet>
  );
}

const ForwardedTabSheet = forwardRef(TabSheet);

export { ForwardedTabSheet as TabSheet };

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
 * @deprecated Use `<TabSheetTab/>` instead.
 */
export function tab(tab: string): Record<string, string> {
  console.warn('Using the `tab` helper function is deprecated. Use <TabSheetTab/> instead.');
  return { tab } as Record<string, string>;
}

import {
  SideNav,
  SideNavItem,
  Accordion,
  AccordionHeading,
  AccordionPanel,
  AvatarGroup,
} from '@vaadin/react-components';
import { Chart, ChartSeries, BoardRow } from '@vaadin/react-components-pro';

export default function Row1() {
  return (
    <BoardRow>
      <SideNav>
        <SideNavItem>Side Navigation Item 1</SideNavItem>
        <SideNavItem>Side Navigation Item 2</SideNavItem>
        <SideNavItem>Side Navigation Item 3</SideNavItem>
      </SideNav>
      <Accordion theme="primary">
        <AccordionPanel summary="Panel 1">
          <div>Accordion content 1</div>
        </AccordionPanel>
        <AccordionPanel>
          <AccordionHeading slot="summary">Panel 2</AccordionHeading>
          <div>Accordion content 2</div>
        </AccordionPanel>
      </Accordion>
      <AvatarGroup prefix="Users: " items={[{ name: 'Jane Roe', abbr: 'JD' }]}></AvatarGroup>
      <Chart title="Chart" style={{ height: '300px' }}>
        <ChartSeries title="Items" type="bar" values={[10, 20, 30]}></ChartSeries>
      </Chart>
    </BoardRow>
  );
}

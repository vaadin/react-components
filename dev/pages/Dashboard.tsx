import { Dashboard } from '../../packages/react-components-pro/src/Dashboard.js';
import { DashboardWidget } from '../../packages/react-components-pro/src/DashboardWidget.js';
import './dashboard-styles.css';

// TODO: import from Dashboard
type DashboardItem = {
  colspan?: number;
  items?: Array<DashboardItem & CustomItem>;
};

type CustomItem = {
  title?: string;
  content?: string;
  type?: 'kpi' | 'chart';
  header?: string;
};

type TestItem = CustomItem & DashboardItem;

export default function () {
  const items: TestItem[] = [
    {
      title: 'Total cost',
      content: '+203%',
      type: 'kpi',
      header: '2023-2024',
    },
    {
      title: 'Sales',
      type: 'chart',
      header: '2023-2024',
      colspan: 2,
    },
    {
      title: 'Section',
      items: [
        {
          title: 'Sales closed this month',
          content: '54 000€',
          type: 'kpi',
        },
        {
          title: 'Just some number',
          content: '1234',
          type: 'kpi',
          header: '2014-2024',
        },
      ],
    },
    {
      title: 'Activity since 2023',
      type: 'chart',
    },
  ];

  return (
    <Dashboard items={items}>
      {({ item }) => (
        <DashboardWidget widgetTitle={item.title}>
          <span slot="header">{item.header || ''}</span>
          {item.type === 'chart' ? <div className="chart"></div> : <div className="kpi-number">{item.content}</div>}
        </DashboardWidget>
      )}
    </Dashboard>
  );
}

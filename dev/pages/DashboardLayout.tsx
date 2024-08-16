import { DashboardLayout } from '../../packages/react-components-pro/src/DashboardLayout.js';
import type { CSSProperties } from 'react';

const dashboardLayoutItemStyle = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '1em',
  textAlign: 'center',
  margin: '0.5em',
  boxSizing: 'border-box',
  height: '100px',
} as CSSProperties;

const dashboardLayoutStyle = {
  '--vaadin-dashboard-col-min-width': '200px',
  '--vaadin-dashboard-col-max-width': '300px',
} as CSSProperties;

export default function () {
  return (
    <DashboardLayout style={dashboardLayoutStyle}>
      <div style={dashboardLayoutItemStyle}>Item 0</div>
      <div style={dashboardLayoutItemStyle}>Item 1</div>
      <div style={dashboardLayoutItemStyle}>Item 2</div>
      <div style={dashboardLayoutItemStyle}>Item 3</div>
      <div style={dashboardLayoutItemStyle}>Item 4</div>
    </DashboardLayout>
  );
}

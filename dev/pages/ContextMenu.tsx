import { ContextMenu } from '../../src/ContextMenu.js';

const items = [
  { text: 'Menu Item 1' },
  { component: <hr /> },
  {
    text: 'Menu Item 2',
    children: [
      { text: 'Menu Item 2-1' },
      {
        text: 'Menu Item 2-2',
        children: [
          { text: 'Menu Item 2-2-1' },
          { text: 'Menu Item 2-2-2', disabled: true },
          { component: <hr /> },
          { text: 'Menu Item 2-2-3' },
        ],
      },
    ],
  },
  { text: 'Menu Item 3', disabled: true },
];

export default function () {
  return (
    <ContextMenu items={items}>
      <div style={{ padding: '10px' }}>Right click me</div>
    </ContextMenu>
  );
}

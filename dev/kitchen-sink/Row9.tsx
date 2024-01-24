import {
  SplitLayout,
  TextArea,
  Tooltip,
  Upload,
  VirtualList,
  type VirtualListReactRendererProps,
} from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

type Item = Readonly<{ value: string; index: number }>;

const items: Item[] = [
  { value: 'foo', index: 0 },
  { value: 'bar', index: 1 },
];

function Renderer({ item }: VirtualListReactRendererProps<Item>) {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <div>{item.value}:</div>
      <div>{item.index}</div>
    </div>
  );
}

export default function Row9() {
  return (
    <BoardRow>
      <SplitLayout>
        <TextArea label="Text Area"></TextArea>
        <Tooltip text="Tooltip">Tooltip content</Tooltip>
      </SplitLayout>
      <Upload></Upload>
      <VirtualList<Item> items={items}>{Renderer}</VirtualList>
    </BoardRow>
  );
}

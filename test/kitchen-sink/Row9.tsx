import { BoardRow } from '../../src/BoardRow.js';
import { SplitLayout } from '../../src/SplitLayout.js';
import { TextArea } from '../../src/TextArea.js';
import { Tooltip } from '../../src/Tooltip.js';
import { Upload } from '../../src/Upload.js';
import { VirtualList, VirtualListReactRendererProps } from '../../src/VirtualList.js';

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

import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { VirtualList, type VirtualListReactRendererProps } from '../packages/react-components/src/VirtualList.js';

describe('VirtualList', () => {
  type Item = Readonly<{ value: string; index: number }>;

  const items: Item[] = [
    { value: 'Foo', index: 0 },
    { value: 'Bar', index: 1 },
  ];

  function Renderer({ item }: VirtualListReactRendererProps<Item>) {
    return <>{item.value}</>;
  }

  function assert() {
    const list = document.querySelector('vaadin-virtual-list');
    expect(list).to.exist;
    expect(list).to.have.text('FooBar');
  }

  it('should use renderer prop if it is set', async () => {
    render(<VirtualList items={items} renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(<VirtualList items={items}>{Renderer}</VirtualList>);
    assert();
  });
});

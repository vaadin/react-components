import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { VirtualList, type VirtualListReactRendererProps } from '../src/VirtualList.js';

useChaiPlugin(chaiDom);

describe('VirtualList', () => {
  type Item = Readonly<{ value: string; index: number }>;

  const items: Item[] = [
    { value: 'Foo', index: 0 },
    { value: 'Bar', index: 1 },
  ];

  function Renderer({ item }: VirtualListReactRendererProps<Item>) {
    return <>{item.value}</>;
  }

  async function until(predicate: () => boolean) {
    while (!predicate()) {
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  async function assert() {
    const list = document.querySelector('vaadin-virtual-list');
    expect(list).to.exist;
    await until(() => !!list?.shadowRoot);

    expect(list).to.have.text('FooBar');
  }

  afterEach(cleanup);

  it('should use renderer prop if it is set', async () => {
    render(<VirtualList items={items} renderer={Renderer} />);
    await assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(<VirtualList items={items}>{Renderer}</VirtualList>);
    await assert();
  });
});

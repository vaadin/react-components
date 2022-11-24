import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ListBox } from '../src/ListBox.js';
import { Item } from '../src/Item.js';
import { Select } from '../src/Select.js';
import catchRender from './utils/catchRender.js';

describe('Select', () => {
  const items = [
    { label: 'Foo', value: 'foo' },
    { label: 'Bar', value: 'bar' },
  ];

  function Renderer(): ReactElement {
    return (
      <ListBox>
        <Item value="foo">Foo</Item>
        <Item value="bar">Bar</Item>
      </ListBox>
    );
  }

  function isListBoxRendered(node: Node) {
    return node instanceof HTMLElement && node.localName.includes('list-box');
  }

  async function assert(container: HTMLElement) {
    const select = container.querySelector('vaadin-select');
    expect(select).not.to.be.undefined;

    const valueButton = select!.querySelector('vaadin-select-value-button');
    expect(valueButton).not.to.be.undefined;

    valueButton!.dispatchEvent(new PointerEvent('click', { bubbles: true }));

    const overlay = document.querySelector('vaadin-select-overlay');
    expect(overlay).not.to.be.undefined;

    await catchRender(overlay!, isListBoxRendered);

    expect(overlay!.textContent).to.equal('FooBar');
  }

  it('should use children if no renderer property set', async () => {
    const { container } = render(<Select items={items} value="bar" />);
    await assert(container);
  });

  it('should use renderer prop if it is set', async () => {
    const { container } = render(<Select items={items} renderer={Renderer} value="bar" />);
    await assert(container);
  });

  it('should use children render function as a renderer prop', async () => {
    const { container } = render(<Select value="bar">{Renderer}</Select>);

    await assert(container);
  });
});

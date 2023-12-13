import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import chaiAsPromised from 'chai-as-promised';
import chaiDom from 'chai-dom';
import type { ReactElement } from 'react';
import { ListBox } from '../src/ListBox.js';
import { Item } from '../src/Item.js';
import { Select, SelectElement } from '../src/Select.js';
import { findByQuerySelector } from './utils/findByQuerySelector.js';

useChaiPlugin(chaiDom);
useChaiPlugin(chaiAsPromised);

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

  async function assert(user: ReturnType<UserEvent['setup']>) {
    const select = await findByQuerySelector('vaadin-select');

    const valueButton = await findByQuerySelector('vaadin-select-value-button', select);
    expect(valueButton).to.have.text('Bar');

    await user.click(valueButton);

    const overlay = await findByQuerySelector('vaadin-select-overlay');
    expect(overlay).to.have.text('FooBar');
  }

  let user: ReturnType<UserEvent['setup']>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should use items if no renderer property set', async () => {
    render(<Select items={items} value="bar" />);
    await assert(user);
  });

  it('should correctly render the value if default value changed', async () => {
    const { rerender } = render(<Select renderer={Renderer} value="bar" />);
    await expect(findByQuerySelector('vaadin-select-value-button')).to.eventually.have.text('Bar');

    rerender(<Select renderer={Renderer} value="foo" />);
    await expect(findByQuerySelector('vaadin-select-value-button')).to.eventually.have.text('Foo');
  });

  describe('renderer', () => {
    function NewRenderer() {
      return (
        <ListBox>
          <Item value="foo">Foo</Item>
          <Item value="bar">Bar</Item>
          <Item value="baz">Baz</Item>
        </ListBox>
      );
    }

    it('should use renderer prop if it is set', async () => {
      render(<Select renderer={Renderer} value="bar" />);
      await assert(user);
    });

    it('should use children render function as a renderer prop', async () => {
      render(<Select value="bar">{Renderer}</Select>);
      await assert(user);
    });

    it('should correctly render the value if renderer prop is changed', async () => {
      render(<Select renderer={Renderer} value="bar" />);
      await findByQuerySelector('vaadin-select-value-button');

      render(<Select renderer={NewRenderer} value="bar" />);

      await expect(findByQuerySelector('vaadin-select-value-button')).to.eventually.have.text('Bar');
    });

    it('should correctly render the value if children prop is changed', async () => {
      render(<Select value="bar">{Renderer}</Select>);
      await findByQuerySelector('vaadin-select-value-button');
      render(<Select value="bar">{NewRenderer}</Select>);

      await expect(findByQuerySelector('vaadin-select-value-button')).to.eventually.have.text('Bar');
    });
  });

  describe('slot', () => {
    it('should render the element with slot if renderer prop is set', async () => {
      render(
        <Select renderer={Renderer}>
          <div slot="prefix">Value:</div>
        </Select>,
      );

      await expect(findByQuerySelector('div[slot="prefix"]')).to.eventually.have.text('Value:');
    });

    it('should render the element with slot if items prop is set', async () => {
      render(
        <Select items={items}>
          <div slot="prefix">Value:</div>
        </Select>,
      );

      await expect(findByQuerySelector('div[slot="prefix"]')).to.eventually.have.text('Value:');
    });

    it('should render the element with slot if children render function is set', async () => {
      render(
        <Select>
          {Renderer}
          <div slot="prefix">Value:</div>
        </Select>,
      );

      await expect(findByQuerySelector('div[slot="prefix"]')).to.eventually.have.text('Value:');
    });

    it('should render the element with slot if children component is set', async () => {
      render(
        <Select>
          <ListBox>
            <Item value="foo">Foo</Item>
            <Item value="bar">Bar</Item>
          </ListBox>
          <div slot="prefix">Value:</div>
        </Select>,
      );

      await expect(findByQuerySelector('div[slot="prefix"]')).to.eventually.have.text('Value:');
    });
  });

  describe('boolean property', () => {
    const booleanProperties: Array<keyof typeof SelectElement.prototype & string> = [
      'disabled',
      'hidden',
      'opened',
      'draggable',
    ];

    booleanProperties.forEach((property) => {
      describe(property, () => {
        it(`should be true in the element if ${property} prop is true`, async () => {
          render(<Select items={[{ label: 'foo', value: 'foo' }]} {...{ [property]: true }} />);
          const select = await findByQuerySelector('vaadin-select');
          expect(select[property]).to.be.ok;
        });

        it(`should be false in the element if ${property} prop is false`, async () => {
          render(<Select items={[{ label: 'foo', value: 'foo' }]} {...{ [property]: false }} />);
          const select = await findByQuerySelector('vaadin-select');
          expect(select[property]).not.to.be.ok;
        });
      });
    });
  });
});

import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import chaiDom from 'chai-dom';
import { TimePicker } from '../src/TimePicker.js';

useChaiPlugin(chaiDom);

describe('TimePicker', () => {
  it('should apply "value" the last', () => {
    const value = '15:20:08';
    const { container } = render(<TimePicker label="Foo" value={value} step={1} />);

    const element = container.querySelector('vaadin-time-picker');
    expect(element).to.exist;

    const input = element!.querySelector('input');

    expect(input).to.have.value(value);
  });
});

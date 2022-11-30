import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import chaiDom from 'chai-dom';
import { DateTimePicker } from '../src/DateTimePicker.js';

useChaiPlugin(chaiDom);

describe('DatePicker', () => {
  it('should apply "value" the last', () => {
    const value = '2022-01-01T15:20:08';
    const { container } = render(<DateTimePicker label="Foo" value={value} step={1} />);

    const element = container.querySelector('vaadin-date-time-picker');
    expect(element).to.exist;

    expect(element).to.have.value(value);
  });
});

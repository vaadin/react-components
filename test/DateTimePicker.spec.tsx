import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { DateTimePicker } from '../packages/react-components/src/DateTimePicker.js';

describe('DatePicker', () => {
  it('should apply "value" the last', () => {
    const value = '2022-01-01T15:20:08';
    const { container } = render(<DateTimePicker label="Foo" value={value} step={1} />);

    const element = container.querySelector('vaadin-date-time-picker');
    expect(element).to.exist;

    expect(element).to.have.value(value);
  });

  it('should not override value set on DOM element on rerender', () => {
    const { container, rerender } = render(<DateTimePicker label="Foo" />);

    const element = container.querySelector('vaadin-date-time-picker');
    expect(element).to.exist;
    element!.value = '2020-01-01T15:00';
    expect(element).to.have.value('2020-01-01T15:00');

    rerender(<DateTimePicker label="Foo" />);
    expect(element).to.have.value('2020-01-01T15:00');
  });
});

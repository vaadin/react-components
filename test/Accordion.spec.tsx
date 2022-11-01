import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { Accordion, AccordionProps, AccordionModule } from '../src/Accordion.js';

describe('Accordion', () => {
  const defaultProps: AccordionProps = {};

  it('should render correctly', () => {
    const root = ReactDOM.createRoot(document.body);
    act(() => {
      root.render(<Accordion />);
    });

    expect(document.querySelector('vaadin-accordion')).not.to.be.undefined;
  });
});

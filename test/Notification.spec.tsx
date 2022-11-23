import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Notification } from '../src/Notification.js';

describe('Notification', () => {
  function Renderer() {
    return <>FooBar</>;
  }

  function assert() {
    const card = document.querySelector('vaadin-notification-card');
    expect(card).not.to.be.undefined;
    expect(card!.textContent).to.equal('FooBar');
  }

  it('should use children if no renderer property set', async () => {
    render(<Notification opened>FooBar</Notification>);
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(<Notification opened renderer={Renderer} />);
    assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(<Notification opened>{Renderer}</Notification>);
    assert();
  });
});

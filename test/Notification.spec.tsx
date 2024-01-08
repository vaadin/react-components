import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { cleanup, render } from '@testing-library/react/pure.js';
import chaiDom from 'chai-dom';
import { Notification, type NotificationElement } from '../src/Notification.js';
import createOverlayCloseCatcher from './utils/createOverlayCloseCatcher.js';

useChaiPlugin(chaiDom);

describe('Notification', () => {
  const overlayTag = 'vaadin-notification-container';

  const [ref, catcher] = createOverlayCloseCatcher<NotificationElement>(overlayTag, (ref) => ref.close());

  function Renderer() {
    return <>FooBar</>;
  }

  async function until(predicate: () => boolean) {
    while (!predicate()) {
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  async function assert() {
    await until(() => !!document.querySelector('vaadin-notification-card'));
    const card = document.querySelector('vaadin-notification-card');
    expect(card).to.exist;
    expect(card).to.have.text('FooBar');
  }

  afterEach(cleanup);
  afterEach(catcher);

  it('should use children if no renderer property set', async () => {
    render(
      <Notification ref={ref} opened>
        FooBar
      </Notification>,
    );
    await assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(<Notification ref={ref} opened renderer={Renderer} />);
    await assert();
  });

  it('should use children render function as a renderer prop', async () => {
    render(
      <Notification ref={ref} opened>
        {Renderer}
      </Notification>,
    );
    await assert();
  });

  describe('show()', () => {
    it('should render correctly', async () => {
      ref.current = await Notification.show('FooBar');
      await assert();
    });
  });
});

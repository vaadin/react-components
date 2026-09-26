import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import sinon from 'sinon';
import { Dialog, type DialogReactRendererProps } from '../packages/react-components/src/Dialog.js';
import { nextRender } from './utils/nextRender.js';
import { useState } from 'react';

describe('Dialog', () => {
  const dialogTag = 'vaadin-dialog';

  function assert() {
    const dialog = document.querySelector(dialogTag);
    expect(dialog).to.exist;

    const childNodes = Array.from(dialog!.childNodes);

    const header = childNodes.find(
      (node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === 'header-content',
    );
    expect(header).to.exist;
    expect(header).to.have.text('Title');

    const footer = childNodes.find(
      (node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === 'footer',
    );
    expect(footer).to.have.text('Footer');

    const body = childNodes.find(
      (node) => node.nodeType === Node.ELEMENT_NODE && !(node as Element).hasAttribute('slot'),
    );
    expect(body).to.have.text('FooBar');
  }

  it('should use children if no renderer property set', async () => {
    await render(
      <Dialog opened header={<>Title</>} footer={<>Footer</>}>
        <span>FooBar</span>
      </Dialog>,
    );
    await nextRender();
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    await render(
      <Dialog
        opened
        headerRenderer={() => <>Title</>}
        footerRenderer={() => <>Footer</>}
        renderer={() => <span>FooBar</span>}
      ></Dialog>,
    );
    await nextRender();
    assert();
  });

  it('should use children as renderer prop', async () => {
    await render(
      <Dialog opened headerRenderer={() => <>Title</>} footerRenderer={() => <>Footer</>}>
        {() => <span>FooBar</span>}
      </Dialog>,
    );
    await nextRender();
    assert();
  });

  it('should pass the dialog element as `original` to a renderer', async () => {
    let received: DialogReactRendererProps['original'] | undefined;
    await render(
      <Dialog
        opened
        renderer={({ original }) => {
          // `original` must never be null/undefined when the renderer runs.
          received = original;
          return <span>{original ? original.localName : 'no-element'}</span>;
        }}
      ></Dialog>,
    );
    await nextRender();

    expect(received).to.exist;
    expect(received!.localName).to.equal(dialogTag);

    const body = Array.from(document.querySelector(dialogTag)!.childNodes).find(
      (node) => node.nodeType === Node.ELEMENT_NODE && !(node as Element).hasAttribute('slot'),
    );
    expect(body).to.have.text(dialogTag);
  });

  it('should not render header / footer wrappers when only content is provided', async () => {
    await render(
      <Dialog opened>
        <span>FooBar</span>
      </Dialog>,
    );
    await nextRender();

    const dialog = document.querySelector(dialogTag)!;
    expect(dialog.querySelector('[slot="header-content"]')).to.not.exist;
    expect(dialog.querySelector('[slot="footer"]')).to.not.exist;
  });

  it('should not render header / footer wrappers for falsy content', async () => {
    const showHeader = false;
    const showFooter = false;
    await render(
      <Dialog opened header={showHeader && <>Title</>} footer={showFooter && <>Footer</>}>
        <span>FooBar</span>
      </Dialog>,
    );
    await nextRender();

    const dialog = document.querySelector(dialogTag)!;
    expect(dialog.querySelector('[slot="header-content"]')).to.not.exist;
    expect(dialog.querySelector('[slot="footer"]')).to.not.exist;
  });

  it('should not warn on open', async () => {
    function TestDialog() {
      const [opened, setOpened] = useState(false);
      return (
        <>
          <button id="open-button" onClick={() => setOpened(true)}>
            Open
          </button>
          <Dialog opened={opened}>FooBar</Dialog>
        </>
      );
    }

    await render(<TestDialog />);
    await nextRender();

    const warn = sinon.stub(console, 'error');
    document.querySelector<HTMLButtonElement>('#open-button')?.click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    warn.restore();

    expect(warn.called).to.be.false;
  });
});

import { expect } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import { Dialog } from '../src/Dialog.js';

describe('Dialog', () => {
  function assert() {
    const dialog = document.querySelector('vaadin-dialog-overlay');
    expect(dialog).not.to.be.undefined;

    const [header, footer, body] = Array.from(dialog!.childNodes);

    expect(header).not.to.be.undefined;
    expect(header!.textContent).to.equal('Title');

    expect(footer).not.to.be.undefined;
    expect(footer!.textContent).to.equal('Footer');

    expect(body).not.to.be.undefined;
    expect(body!.textContent).to.equal('FooBar');
  }

  afterEach(() => {
    for (const overlay of Array.from(document.querySelectorAll('vaadin-dialog-overlay'))) {
      overlay.remove();
    }
  });

  it('should use children if no renderer property set', async () => {
    render(
      <Dialog opened header={<>Title</>} footer={<>Footer</>}>
        FooBar
      </Dialog>,
    );
    assert();
  });

  it('should use renderer prop if it is set', async () => {
    render(
      <Dialog
        opened
        headerRenderer={() => <>Title</>}
        footerRenderer={() => <>Footer</>}
        renderer={() => <>FooBar</>}
      ></Dialog>,
    );
    assert();
  });

  it('should use children as renderer prop', async () => {
    render(
      <Dialog opened headerRenderer={() => <>Title</>} footerRenderer={() => <>Footer</>}>
        {() => <>FooBar</>}
      </Dialog>,
    );
    assert();
  });
});

import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import { Dialog as _Dialog, DialogModule, type DialogProps as _DialogProps } from './generated/Dialog.js';
import { createSimpleRenderer, type ReactSimpleRenderer } from './renderers/simpleRenderer.js';

export type DialogReactRenderer = ReactSimpleRenderer<DialogModule.Dialog>;

export type DialogProps = Omit<_DialogProps, 'renderer'> &
  Readonly<{
    renderer?: DialogReactRenderer;
  }>;

function Dialog(props: DialogProps, ref: ForwardedRef<DialogModule.Dialog>): ReactElement | null {
  return (
    <_Dialog
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      renderer={props.renderer && (createSimpleRenderer(props.renderer) as DialogModule.DialogRenderer)}
    />
  );
}

const ForwardedDialog = forwardRef(Dialog);

export { ForwardedDialog as Dialog, DialogModule };

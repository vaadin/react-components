import { type ForwardedRef, forwardRef, type ReactElement, ReactNode } from 'react';
import { Dialog as _Dialog, DialogModule, type DialogProps as _DialogProps } from './generated/Dialog.js';
import { useChildrenRenderer } from './renderers/useChildrenRenderer.js';

export type DialogProps = Omit<_DialogProps, 'renderer' | 'headerRenderer' | 'footerRenderer'> &
  Readonly<{
    header: ReactNode;
    footer: ReactNode;
  }>;

function Dialog(
  { footer, header, ...props }: DialogProps,
  ref: ForwardedRef<DialogModule.Dialog>,
): ReactElement | null {
  const [footerPortals, footerRenderer] = useChildrenRenderer(footer);
  const [headerPortals, headerRenderer] = useChildrenRenderer(header);
  const [portals, renderer] = useChildrenRenderer(props.children);

  return (
    <_Dialog {...props} ref={ref} footerRenderer={footerRenderer} headerRenderer={headerRenderer} renderer={renderer}>
      {headerPortals}
      {footerPortals}
      {portals}
    </_Dialog>
  );
}

const ForwardedDialog = forwardRef(Dialog);

export { ForwardedDialog as Dialog, DialogModule };

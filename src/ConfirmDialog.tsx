import { type ForwardedRef, forwardRef, type ReactElement, ReactNode } from 'react';
import {
  ConfirmDialog as _ConfirmDialog,
  ConfirmDialogModule,
  type ConfirmDialogProps as _ConfirmDialogProps,
} from './generated/ConfirmDialog.js';

export type ConfirmDialogProps = _ConfirmDialogProps &
  Readonly<{
    children?: _ConfirmDialogProps['message'];
  }>;

function ConfirmDialog(
  props: ConfirmDialogProps,
  ref: ForwardedRef<ConfirmDialogModule.ConfirmDialog>,
): ReactElement | null {
  return <_ConfirmDialog {...props} ref={ref} message={props.message ?? props.children} />;
}

const ForwardedConfirmDialog = forwardRef(ConfirmDialog);

export { ForwardedConfirmDialog as ConfirmDialog, ConfirmDialogModule };

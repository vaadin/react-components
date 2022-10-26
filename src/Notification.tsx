import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Notification as _Notification,
  NotificationModule,
  type NotificationProps as _NotificationProps,
} from './generated/Notification.js';
import { createSimpleRenderer, type ReactSimpleRenderer } from './renderers/simpleRenderer.js';

export type NotificationReactRenderer = ReactSimpleRenderer<NotificationModule.Notification>;

export type NotificationProps = Omit<_NotificationProps, 'renderer'> &
  Readonly<{
    renderer?: NotificationReactRenderer;
  }>;

function Notification(
  props: NotificationProps,
  ref: ForwardedRef<NotificationModule.Notification>,
): ReactElement | null {
  return (
    <_Notification
      {...props}
      ref={ref}
      // TODO: remove cast after the nullability issue is fixed
      renderer={props.renderer && (createSimpleRenderer(props.renderer) as NotificationModule.NotificationRenderer)}
    />
  );
}

const ForwardedNotification = forwardRef(Notification);

export { ForwardedNotification as Notification, NotificationModule };

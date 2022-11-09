import type { NotificationRenderer } from '@vaadin/notification';
import { ComponentType, type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Notification as _Notification,
  NotificationModule,
  type NotificationProps as _NotificationProps,
} from './generated/Notification.js';
import { useChildrenRenderer } from "./renderers/useChildrenRenderer.js";
import { useSimpleRenderer, type ReactSimpleRendererProps} from './renderers/useSimpleRenderer.js';

export type NotificationProps = Omit<_NotificationProps, 'renderer'>;

function Notification(
  props: NotificationProps,
  ref: ForwardedRef<NotificationModule.Notification>,
): ReactElement | null {
  const [portals, renderer] = useChildrenRenderer(props.children);

  return (
    <_Notification
      {...props}
      ref={ref}
      renderer={renderer}
    >
      {portals}
    </_Notification>
  );
}

const ForwardedNotification = forwardRef(Notification);

export { ForwardedNotification as Notification, NotificationModule };

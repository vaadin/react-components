import {
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import {
  Notification as _Notification,
  type NotificationElement,
  type NotificationProps as _NotificationProps,
  type ShowOptions,
} from './generated/Notification.js';
import { useSimpleOrChildrenRenderer } from './renderers/useSimpleOrChildrenRenderer.js';
import type { ReactSimpleRendererProps } from './renderers/useSimpleRenderer.js';

export * from './generated/Notification.js';

export type NotificationReactRendererProps = ReactSimpleRendererProps<NotificationElement>;

type OmittedNotificationHTMLAttributes = Omit<
  HTMLAttributes<NotificationElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot'
>;

export type NotificationProps = Partial<
  Omit<_NotificationProps, 'children' | 'renderer' | keyof OmittedNotificationHTMLAttributes>
> &
  Readonly<{
    children?: ReactNode | ComponentType<NotificationReactRendererProps>;
    renderer?: ComponentType<NotificationReactRendererProps>;
  }>;

function Notification(
  { children, ...props }: NotificationProps,
  ref: ForwardedRef<NotificationElement>,
): ReactElement | null {
  const [portals, renderer] = useSimpleOrChildrenRenderer(props.renderer, children);

  return (
    <_Notification {...props} ref={ref} renderer={renderer}>
      {portals}
    </_Notification>
  );
}

export type NotificationFunction = ForwardRefExoticComponent<NotificationProps & RefAttributes<NotificationElement>> & {
  show(contents: string, options?: ShowOptions): Promise<NotificationElement>;
  define(): Promise<void>;
};

const ForwardedNotification = forwardRef(Notification) as NotificationFunction;

Object.assign(ForwardedNotification, { define: _Notification.define });

ForwardedNotification.show = async function (contents: string, options?: ShowOptions) {
  await ForwardedNotification.define();
  const Notification = customElements.get('vaadin-notification') as typeof NotificationElement;
  return Notification.show(contents, options);
};

export { ForwardedNotification as Notification };

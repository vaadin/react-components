import { type ComponentType, type ForwardedRef, forwardRef, type ReactElement, type RefAttributes } from 'react';
import {
  MessageList as _MessageList,
  type MessageListElement,
  type MessageListItemModel,
  type MessageListItem,
  type MessageListProps as _MessageListProps,
} from './generated/MessageList.js';
import { type ReactModelRendererProps, useModelRenderer } from './renderers/useModelRenderer.js';

export * from './generated/MessageList.js';

export type MessageListRendererProps = ReactModelRendererProps<
  MessageListItem,
  MessageListItemModel,
  MessageListElement
>;

export type MessageListProps = Partial<Omit<_MessageListProps, 'children' | 'renderer'>> &
  Readonly<{
    children?: ComponentType<MessageListRendererProps> | null;
    renderer?: ComponentType<MessageListRendererProps> | null;
  }>;

function MessageList(props: MessageListProps, ref: ForwardedRef<MessageListElement>): ReactElement | null {
  const [portals, renderer] = useModelRenderer(props.renderer ?? props.children);

  return (
    <_MessageList {...props} ref={ref} renderer={renderer}>
      {portals}
    </_MessageList>
  );
}

const ForwardedMessageList = forwardRef(MessageList) as (
  props: MessageListProps & RefAttributes<MessageListElement>,
) => ReactElement | null;

export { ForwardedMessageList as MessageList };

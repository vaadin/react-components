import { Message, MessageInput, MessageList } from '@vaadin/react-components';
import { BoardRow } from '@vaadin/react-components-pro';

export default function Row7() {
  return (
    <BoardRow>
      <MessageList
        items={[
          { text: 'Hello', time: 'today', userName: 'Bot' },
          { text: 'Message list', time: 'today', userName: 'Bot' },
        ]}
      ></MessageList>
      <Message userName="Test User">Message</Message>
      <MessageInput></MessageInput>
    </BoardRow>
  );
}

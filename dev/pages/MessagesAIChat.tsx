import { useCallback, useState } from 'react';
import './MessagesAIChat.css';
import { MessageInput, type MessageInputSubmitEvent } from '../../packages/react-components/src/MessageInput.js';
import {
  MessageList,
  type MessageListItem,
  type MessageListRendererProps,
} from '../../packages/react-components/src/MessageList.js';
import { Markdown } from '../../packages/react-components/src/Markdown.js';

function simulateMessageStream() {
  const answerMarkdown = `## Hello! I’m your AI assistant 🤖

I can help you with:

1. **Answering questions** – from quick facts to in-depth explanations.  
2. **Explaining concepts** – breaking down complex ideas into clear, step-by-step logic.  
3. **Brainstorming & creativity** – generating outlines, stories, code snippets, or design ideas.  
4. **Guidance & troubleshooting** – walking you through processes or helping debug issues.  

---

### How to get the most out of me 🛠️

| Step | What to do | Why it matters |
|------|------------|----------------|
| 1️⃣ | **State your goal clearly.** | A precise prompt yields a precise answer. |
| 2️⃣ | **Add constraints or context.** <br>*(e.g., audience, length, tone)* | Tailors the response to your needs. |
| 3️⃣ | **Ask follow-ups.** | We can iterate until you’re satisfied. |

---

#### Example

> **You:** “Explain quantum entanglement in simple terms.”

> **Me:**  
> *Imagine two coins spun so perfectly in sync that the moment you look at one and see “heads,” the other coin—no matter how far away—will instantly show “tails.” In quantum physics, particles can become linked in just that way…*  

---

Need anything else? Just let me know, and I’ll jump right in! ✨`;

  let onNextCallback: ((token: string) => void) | null = null;
  let onCompleteCallback: (() => void) | null = null;

  const subscription = {
    onNext: (callback: typeof onNextCallback) => {
      onNextCallback = callback;

      const tokenLength = 10;

      setTimeout(async () => {
        let tokenIndex = 0;
        while (tokenIndex < answerMarkdown.length) {
          const token = answerMarkdown.substring(tokenIndex, tokenIndex + tokenLength);
          tokenIndex += tokenLength;
          if (onNextCallback) {
            onNextCallback(token);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (onCompleteCallback) {
          onCompleteCallback();
        }
      }, 1000);

      return subscription;
    },
    onComplete: (callback: typeof onCompleteCallback) => {
      onCompleteCallback = callback;
      return subscription;
    },
  };

  return subscription;
}

function createUserMessage(text: string): MessageListItem {
  return {
    text,
    time: 'Just now',
    userName: 'User',
    userColorIndex: 1,
  };
}

function createAssistantMessage(text: string): MessageListItem {
  return {
    text,
    time: 'Just now',
    userName: 'Assistant',
    userColorIndex: 2,
  };
}

export default function MessagesAIChat() {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [items, setItems] = useState<MessageListItem[]>([
    createUserMessage('Hello! Can you help me with a question?'),
    createAssistantMessage("Of course! I'm here to help. What's your question?"),
  ]);

  const handleSubmit = useCallback((e: MessageInputSubmitEvent) => {
    setInputDisabled(true);

    setItems((prevMessages) => [...prevMessages, createUserMessage(e.detail.value)]);

    const newAssistantItem = createAssistantMessage('');
    simulateMessageStream()
      .onNext((token) => {
        newAssistantItem.text += token;
        setItems((prevItems) =>
          prevItems.includes(newAssistantItem) ? [...prevItems] : [...prevItems, newAssistantItem],
        );
      })
      .onComplete(() => {
        setInputDisabled(false);
      });
  }, []);

  const renderer = useCallback(({ item }: MessageListRendererProps) => <Markdown>{item.text}</Markdown>, []);

  return (
    <div id="chat">
      <MessageList items={items}>{renderer}</MessageList>
      <MessageInput disabled={inputDisabled} onSubmit={handleSubmit} />
    </div>
  );
}

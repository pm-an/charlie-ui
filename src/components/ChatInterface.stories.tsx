import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatInterface, type ChatMessage } from "./ChatInterface";
import { useState } from "react";

const meta: Meta<typeof ChatInterface> = {
  title: "Blocks/Application/ChatInterface",
  component: ChatInterface,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChatInterface>;

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    content: "Hey! Have you had a chance to review the new design mockups?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "You",
    content: "Yes, they look great! I especially like the updated navigation pattern.",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: "3",
    sender: "Sarah Chen",
    content: "Awesome! The client was really happy with the direction we took on the dashboard layout.",
    timestamp: "10:33 AM",
  },
  {
    id: "4",
    sender: "You",
    content: "That's good to hear. Should we schedule a call to discuss the implementation timeline?",
    timestamp: "10:35 AM",
    isCurrentUser: true,
  },
  {
    id: "5",
    sender: "Sarah Chen",
    content: "Sure, how about tomorrow at 2pm?",
    timestamp: "10:36 AM",
  },
  {
    id: "6",
    sender: "You",
    content: "Works for me. I'll send the calendar invite.",
    timestamp: "10:37 AM",
    isCurrentUser: true,
  },
  {
    id: "7",
    sender: "Sarah Chen",
    content: "Perfect. Also, can you share the latest component library build? I want to test the new form components.",
    timestamp: "10:38 AM",
  },
  {
    id: "8",
    sender: "You",
    content: "I just pushed the latest build to staging. You should be able to access it at the usual URL.",
    timestamp: "10:40 AM",
    isCurrentUser: true,
  },
  {
    id: "9",
    sender: "Sarah Chen",
    content: "Great, thanks! I'll take a look after lunch and let you know if I find any issues.",
    timestamp: "10:41 AM",
  },
  {
    id: "10",
    sender: "You",
    content: "Sounds good. Talk to you later!",
    timestamp: "10:42 AM",
    isCurrentUser: true,
  },
];

export const Default: Story = {
  render: (args) => {
    const [messages, setMessages] = useState(args.messages);
    return (
      <ChatInterface
        {...args}
        messages={messages}
        onSendMessage={(content) => {
          setMessages((prev) => [
            ...prev,
            {
              id: String(prev.length + 1),
              sender: "You",
              content,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isCurrentUser: true,
            },
          ]);
        }}
      />
    );
  },
  args: {
    messages: sampleMessages,
    currentUser: "You",
    title: "Sarah Chen",
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    currentUser: "You",
    title: "New Conversation",
  },
};

import { forwardRef, useState, type HTMLAttributes, type FormEvent } from "react";
import { cn } from "../utils/cn";
import { Send } from "lucide-react";

export type ChatMessage = {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  avatar?: string;
  isCurrentUser?: boolean;
};

export type ChatInterfaceProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  messages: ChatMessage[];
  onSendMessage?: (message: string) => void;
  currentUser?: string;
  placeholder?: string;
  title?: string;
};

const ChatInterface = forwardRef<HTMLDivElement, ChatInterfaceProps>(
  (
    {
      className,
      messages,
      onSendMessage,
      currentUser = "You",
      placeholder = "Type a message...",
      title = "Messages",
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && onSendMessage) {
        onSendMessage(trimmed);
        setInputValue("");
      }
    };

    return (
      <div
        ref={ref}
        data-slot="chat-interface"
        className={cn(
          "rounded-xl border border-border overflow-hidden flex flex-col h-[500px] bg-[#0a0a0b]",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green" />
          <h3 className="text-sm font-semibold text-text-loud">{title}</h3>
          <span className="text-xs text-fg-200">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" tabIndex={0} role="log" aria-label="Chat messages">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-sm text-fg-200">No messages yet. Start a conversation.</p>
            </div>
          )}
          {messages.map((message) => {
            const isMe = message.isCurrentUser ?? message.sender === currentUser;
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-bg-subtle-hover shrink-0 flex items-center justify-center overflow-hidden">
                  {message.avatar ? (
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-fg-200">
                      {message.sender.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "max-w-[70%] flex flex-col",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  <span className="text-xs text-fg-200 mb-1">{message.sender}</span>
                  <div
                    className={cn(
                      "px-3 py-2 text-sm text-text-loud",
                      isMe
                        ? "bg-bg-subtle-hover rounded-2xl rounded-br-md"
                        : "bg-bg-subtle rounded-2xl rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-fg-200 mt-1">{message.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-border p-3 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-bg-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-loud placeholder:text-fg-200 outline-none focus:border-border-hover transition-colors"
          />
          <button
            type="submit"
            className="bg-bg-subtle-hover rounded-lg p-2 hover:bg-bg-subtle-hover transition-colors text-fg-200 hover:text-text-loud"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    );
  }
);

ChatInterface.displayName = "ChatInterface";

export { ChatInterface };

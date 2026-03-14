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
          "rounded-xl border border-white/[0.06] overflow-hidden flex flex-col h-[500px] bg-[#0a0a0b]",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className="text-xs text-white/70">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" tabIndex={0} role="log" aria-label="Chat messages">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-sm text-white/70">No messages yet. Start a conversation.</p>
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
                <div className="h-8 w-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                  {message.avatar ? (
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-white/70">
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
                  <span className="text-xs text-white/70 mb-1">{message.sender}</span>
                  <div
                    className={cn(
                      "px-3 py-2 text-sm text-white",
                      isMe
                        ? "bg-white/10 rounded-2xl rounded-br-md"
                        : "bg-white/5 rounded-2xl rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-white/70 mt-1">{message.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-white/[0.06] p-3 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-white/5 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none focus:border-white/15 transition-colors"
          />
          <button
            type="submit"
            className="bg-white/10 rounded-lg p-2 hover:bg-white/15 transition-colors text-white/70 hover:text-white"
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

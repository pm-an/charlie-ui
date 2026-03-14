import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatInterface, type ChatMessage } from "../ChatInterface";

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "Alice",
    content: "Hello there!",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "You",
    content: "Hi Alice!",
    timestamp: "10:01 AM",
    isCurrentUser: true,
  },
];

describe("ChatInterface", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <ChatInterface messages={sampleMessages} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(
        <ChatInterface messages={sampleMessages} />
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "chat-interface");
    });

    it("applies custom className", () => {
      const { container } = render(
        <ChatInterface messages={sampleMessages} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ChatInterface ref={ref} messages={sampleMessages} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders all messages", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByText("Hello there!")).toBeInTheDocument();
      expect(screen.getByText("Hi Alice!")).toBeInTheDocument();
    });

    it("renders sender names", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("renders timestamps", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
      expect(screen.getByText("10:01 AM")).toBeInTheDocument();
    });

    it("renders avatar fallback initials", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getAllByText("A").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("header", () => {
    it("renders default title", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByText("Messages")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(<ChatInterface messages={sampleMessages} title="Team Chat" />);
      expect(screen.getByText("Team Chat")).toBeInTheDocument();
    });

    it("shows message count", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByText("2 messages")).toBeInTheDocument();
    });

    it("shows singular message text for 1 message", () => {
      render(
        <ChatInterface messages={[sampleMessages[0]]} />
      );
      expect(screen.getByText("1 message")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty state when no messages", () => {
      render(<ChatInterface messages={[]} />);
      expect(screen.getByText("No messages yet. Start a conversation.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onSendMessage when form is submitted", () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={sampleMessages} onSendMessage={onSendMessage} />
      );
      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "New message" } });
      fireEvent.submit(input.closest("form")!);
      expect(onSendMessage).toHaveBeenCalledWith("New message");
    });

    it("clears input after sending", () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={sampleMessages} onSendMessage={onSendMessage} />
      );
      const input = screen.getByPlaceholderText("Type a message...") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "New message" } });
      fireEvent.submit(input.closest("form")!);
      expect(input.value).toBe("");
    });

    it("does not send empty messages", () => {
      const onSendMessage = vi.fn();
      render(
        <ChatInterface messages={sampleMessages} onSendMessage={onSendMessage} />
      );
      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.submit(input.closest("form")!);
      expect(onSendMessage).not.toHaveBeenCalled();
    });

    it("renders send button with aria-label", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    });

    it("uses custom placeholder", () => {
      render(
        <ChatInterface messages={sampleMessages} placeholder="Say something..." />
      );
      expect(screen.getByPlaceholderText("Say something...")).toBeInTheDocument();
    });
  });

  describe("message alignment", () => {
    it("aligns current user messages to the right", () => {
      const { container } = render(
        <ChatInterface messages={sampleMessages} currentUser="You" />
      );
      const messageContainers = container.querySelectorAll("[data-slot='chat-interface'] > div:nth-child(2) > div");
      // The second message (isCurrentUser: true) should have flex-row-reverse
      const currentUserMsg = Array.from(messageContainers).find((el) =>
        el.classList.contains("flex-row-reverse")
      );
      expect(currentUserMsg).toBeTruthy();
    });

    it("aligns other user messages to the left", () => {
      const { container } = render(
        <ChatInterface messages={sampleMessages} currentUser="You" />
      );
      const messageContainers = container.querySelectorAll("[data-slot='chat-interface'] > div:nth-child(2) > div");
      const otherUserMsg = Array.from(messageContainers).find(
        (el) => el.classList.contains("flex-row") && !el.classList.contains("flex-row-reverse")
      );
      expect(otherUserMsg).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has send button", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
    });

    it("has text input", () => {
      render(<ChatInterface messages={sampleMessages} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});

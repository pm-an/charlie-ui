import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NotificationPanel, type NotificationItem } from "../NotificationPanel";

const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New deployment",
    description: "Production deployment completed",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Pull request merged",
    description: "PR #42 has been merged into main",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "3",
    title: "Build failed",
    timestamp: "2 hours ago",
    read: false,
  },
];

describe("NotificationPanel", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <NotificationPanel notifications={sampleNotifications} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(
        <NotificationPanel notifications={sampleNotifications} />
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "notification-panel");
    });

    it("applies custom className", () => {
      const { container } = render(
        <NotificationPanel notifications={sampleNotifications} className="custom" />
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<NotificationPanel ref={ref} notifications={sampleNotifications} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders all notification titles", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.getByText("New deployment")).toBeInTheDocument();
      expect(screen.getByText("Pull request merged")).toBeInTheDocument();
      expect(screen.getByText("Build failed")).toBeInTheDocument();
    });

    it("renders descriptions when provided", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.getByText("Production deployment completed")).toBeInTheDocument();
      expect(screen.getByText("PR #42 has been merged into main")).toBeInTheDocument();
    });

    it("renders timestamps", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
      expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("renders default title", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });

    it("renders custom title", () => {
      render(<NotificationPanel notifications={sampleNotifications} title="Updates" />);
      expect(screen.getByText("Updates")).toBeInTheDocument();
    });

    it("shows unread count badge", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows mark all read button when there are unread notifications", () => {
      const onMarkAllRead = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onMarkAllRead={onMarkAllRead}
        />
      );
      expect(screen.getByText("Mark all read")).toBeInTheDocument();
    });

    it("hides mark all read when all are read", () => {
      const allRead = sampleNotifications.map((n) => ({ ...n, read: true }));
      const onMarkAllRead = vi.fn();
      render(
        <NotificationPanel
          notifications={allRead}
          onMarkAllRead={onMarkAllRead}
        />
      );
      expect(screen.queryByText("Mark all read")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders default empty message", () => {
      render(<NotificationPanel notifications={[]} />);
      expect(screen.getByText("No notifications")).toBeInTheDocument();
    });

    it("renders custom empty message", () => {
      render(
        <NotificationPanel notifications={[]} emptyMessage="All caught up!" />
      );
      expect(screen.getByText("All caught up!")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onMarkRead when a notification is clicked", () => {
      const onMarkRead = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onMarkRead={onMarkRead}
        />
      );
      fireEvent.click(screen.getByText("New deployment"));
      expect(onMarkRead).toHaveBeenCalledWith("1");
    });

    it("calls onMarkAllRead when mark all read is clicked", () => {
      const onMarkAllRead = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onMarkAllRead={onMarkAllRead}
        />
      );
      fireEvent.click(screen.getByText("Mark all read"));
      expect(onMarkAllRead).toHaveBeenCalledTimes(1);
    });

    it("calls onDismiss when dismiss button is clicked", () => {
      const onDismiss = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onDismiss={onDismiss}
        />
      );
      const dismissButtons = screen.getAllByLabelText(/^Dismiss /);
      fireEvent.click(dismissButtons[0]);
      expect(onDismiss).toHaveBeenCalledWith("1");
    });

    it("does not trigger onMarkRead when dismiss is clicked", () => {
      const onMarkRead = vi.fn();
      const onDismiss = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onMarkRead={onMarkRead}
          onDismiss={onDismiss}
        />
      );
      const dismissButtons = screen.getAllByLabelText(/^Dismiss /);
      fireEvent.click(dismissButtons[0]);
      expect(onDismiss).toHaveBeenCalled();
      expect(onMarkRead).not.toHaveBeenCalled();
    });
  });

  describe("unread indicators", () => {
    it("applies unread background styling", () => {
      const { container } = render(
        <NotificationPanel notifications={sampleNotifications} />
      );
      const items = container.querySelectorAll("[role='button']");
      // First item is unread
      expect(items[0]).toHaveClass("bg-white/[0.02]");
    });
  });

  describe("conditional rendering", () => {
    it("renders icon when provided", () => {
      const notifications: NotificationItem[] = [
        {
          id: "1",
          title: "With icon",
          timestamp: "now",
          icon: <span data-testid="custom-icon">!</span>,
        },
      ];
      render(<NotificationPanel notifications={notifications} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders fallback initial when no avatar or icon", () => {
      const notifications: NotificationItem[] = [
        {
          id: "1",
          title: "Test notification",
          timestamp: "now",
        },
      ];
      render(<NotificationPanel notifications={notifications} />);
      expect(screen.getByText("T")).toBeInTheDocument();
    });

    it("does not render dismiss buttons when onDismiss is not provided", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      expect(screen.queryAllByLabelText(/^Dismiss /)).toHaveLength(0);
    });
  });

  describe("accessibility", () => {
    it("notification items have button role", () => {
      render(<NotificationPanel notifications={sampleNotifications} />);
      const items = screen.getAllByRole("button");
      // At least the notification items should be buttons
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it("supports keyboard interaction on notifications", () => {
      const onMarkRead = vi.fn();
      render(
        <NotificationPanel
          notifications={sampleNotifications}
          onMarkRead={onMarkRead}
        />
      );
      const items = screen.getAllByRole("button");
      fireEvent.keyDown(items[0], { key: "Enter" });
      expect(onMarkRead).toHaveBeenCalledWith("1");
    });
  });
});

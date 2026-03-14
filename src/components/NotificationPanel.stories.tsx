import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationPanel, type NotificationItem } from "./NotificationPanel";
import { useState } from "react";
import { GitPullRequest, MessageSquare, AlertTriangle, CheckCircle, Bell, Star, UserPlus, Package } from "lucide-react";

const meta: Meta<typeof NotificationPanel> = {
  title: "Blocks/Application/NotificationPanel",
  component: NotificationPanel,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NotificationPanel>;

const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New pull request review",
    description: "Sarah Chen requested your review on PR #142: Update authentication flow",
    timestamp: "2 minutes ago",
    read: false,
    icon: <GitPullRequest className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Deployment succeeded",
    description: "Production deployment for v2.4.1 completed successfully",
    timestamp: "15 minutes ago",
    read: false,
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "New comment on issue #89",
    description: "Alex mentioned you: 'Can we add dark mode support to the sidebar component?'",
    timestamp: "1 hour ago",
    read: false,
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "4",
    title: "Build warning",
    description: "3 deprecation warnings detected in the latest build. Review recommended.",
    timestamp: "2 hours ago",
    read: true,
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "5",
    title: "Team member joined",
    description: "Jordan Lee has joined the Frontend team",
    timestamp: "4 hours ago",
    read: true,
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: "6",
    title: "Package update available",
    description: "React 19.1.0 is now available. Current version: 19.0.0",
    timestamp: "6 hours ago",
    read: true,
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: "7",
    title: "Repository starred",
    description: "charlie-ui has reached 1,000 stars on GitHub",
    timestamp: "Yesterday",
    read: true,
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: "8",
    title: "Scheduled maintenance",
    description: "Staging environment will be unavailable on March 15 from 2:00 AM to 4:00 AM UTC",
    timestamp: "2 days ago",
    read: true,
    icon: <Bell className="h-4 w-4" />,
  },
];

export const Default: Story = {
  render: (args) => {
    const [notifications, setNotifications] = useState(args.notifications);
    return (
      <div className="max-w-md mx-auto p-4">
        <NotificationPanel
          {...args}
          notifications={notifications}
          onMarkRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onDismiss={(id) =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
        />
      </div>
    );
  },
  args: {
    notifications: sampleNotifications,
  },
};

export const Empty: Story = {
  args: {
    notifications: [],
  },
};

export const AllRead: Story = {
  args: {
    notifications: sampleNotifications.map((n) => ({ ...n, read: true })),
  },
};

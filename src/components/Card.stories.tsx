import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Settings } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Cards/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <p className="text-sm text-white/60">
        This is a default card with some content. Cards are the fundamental
        surface element used to group related information together.
      </p>
    ),
  },
};

export const WithHeader: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        description="Manage your account preferences"
      />
      <Card.Body>
        <p className="text-sm text-white/60">
          Configure your workspace settings, notification preferences, and
          security options from this panel.
        </p>
      </Card.Body>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <p className="text-sm text-white/60">
          Your current plan includes 10 GB of storage and 3 team members. Upgrade
          to unlock more features.
        </p>
      </Card.Body>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Last updated 2 hours ago</span>
          <button
            type="button"
            className="text-sm font-medium text-white/80 hover:text-white"
          >
            Upgrade
          </button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

export const Translucent: Story = {
  args: {
    variant: "translucent",
    children: (
      <p className="text-sm text-white/60">
        This card uses the translucent variant with a backdrop blur effect,
        allowing the background to show through subtly.
      </p>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: (
      <p className="text-sm text-white/60">
        This card uses the outline variant with a transparent background and a
        subtle border, ideal for secondary content.
      </p>
    ),
  },
};

export const FullCard: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Header
        icon={<Settings className="h-5 w-5" />}
        title="Project Overview"
        description="Track your project progress"
      />
      <Card.Body>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Tasks completed</span>
            <span className="text-sm font-medium text-white">24 / 36</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div className="h-2 w-2/3 rounded-full bg-white/60" />
          </div>
          <p className="text-sm text-white/60">
            Your team is on track to complete all tasks by the end of the sprint.
          </p>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Sprint ends in 4 days</span>
          <button
            type="button"
            className="text-sm font-medium text-white/80 hover:text-white"
          >
            View Details
          </button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./Timeline";
import {
  Check,
  GitCommit,
  MessageSquare,
  AlertCircle,
  Star,
  Rocket,
} from "lucide-react";

const meta: Meta<typeof Timeline> = {
  title: "Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Project created"
        description="Repository initialized with base configuration"
        timestamp="2 hours ago"
      />
      <Timeline.Item
        title="Initial commit pushed"
        description="Added README, license, and project structure"
        timestamp="1 hour ago"
      />
      <Timeline.Item
        title="CI pipeline configured"
        description="GitHub Actions workflow added for linting and testing"
        timestamp="45 min ago"
      />
      <Timeline.Item
        title="First pull request opened"
        description="Feature branch submitted for review by the team"
        timestamp="30 min ago"
      />
      <Timeline.Item
        title="Code review completed"
        description="All checks passed, approved by two reviewers"
        timestamp="Just now"
      />
    </Timeline>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Deployment started"
        description="Build artifacts uploaded to staging environment"
        timestamp="10:32 AM"
        icon={<Rocket className="h-4 w-4" />}
        color="accent"
      />
      <Timeline.Item
        title="Tests passed"
        description="All 142 test suites passed successfully"
        timestamp="10:28 AM"
        icon={<Check className="h-4 w-4" />}
        color="green"
      />
      <Timeline.Item
        title="Code committed"
        description="feat: add user authentication module"
        timestamp="10:15 AM"
        icon={<GitCommit className="h-4 w-4" />}
        color="blue"
      />
      <Timeline.Item
        title="Review requested"
        description="Assigned to @sarah for code review"
        timestamp="10:00 AM"
        icon={<MessageSquare className="h-4 w-4" />}
      />
    </Timeline>
  ),
};

export const Colored: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Default color"
        description="Standard timeline dot"
        color="default"
      />
      <Timeline.Item
        title="Accent color"
        description="Highlighted with accent theme color"
        color="accent"
      />
      <Timeline.Item
        title="Green color"
        description="Indicates success or completion"
        color="green"
      />
      <Timeline.Item
        title="Red color"
        description="Indicates an error or critical event"
        color="red"
      />
      <Timeline.Item
        title="Blue color"
        description="Informational or neutral highlight"
        color="blue"
      />
      <Timeline.Item
        title="Yellow color"
        description="Warning or attention needed"
        color="yellow"
      />
    </Timeline>
  ),
};

export const ActiveItem: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Order placed"
        description="Your order has been confirmed"
        timestamp="Mar 10"
        color="green"
        icon={<Check className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Payment processed"
        description="Payment of $129.99 received"
        timestamp="Mar 10"
        color="green"
        icon={<Check className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Shipping in progress"
        description="Package picked up by carrier"
        timestamp="Mar 11"
        color="accent"
        icon={<Rocket className="h-4 w-4" />}
        active
      />
      <Timeline.Item
        title="Delivered"
        description="Estimated arrival Mar 14"
        color="default"
      />
    </Timeline>
  ),
};

export const WithChildren: Story = {
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Bug reported"
        description="Critical issue found in production"
        timestamp="Yesterday"
        color="red"
        icon={<AlertCircle className="h-4 w-4" />}
      >
        <div className="mt-2 rounded-lg border border-white/[0.06] bg-white/5 p-3">
          <p className="text-xs text-white/60">
            Error: Connection timeout on /api/users endpoint. Affecting
            approximately 15% of requests during peak hours.
          </p>
        </div>
      </Timeline.Item>
      <Timeline.Item
        title="Fix deployed"
        description="Connection pool size increased"
        timestamp="Today"
        color="green"
        icon={<Check className="h-4 w-4" />}
        active
      >
        <div className="mt-2 flex gap-2">
          <span className="rounded-md bg-green/10 px-2 py-0.5 text-xs text-green">
            resolved
          </span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
            hotfix
          </span>
        </div>
      </Timeline.Item>
      <Timeline.Item
        title="Post-mortem scheduled"
        description="Team retrospective on incident response"
        timestamp="Tomorrow"
        icon={<Star className="h-4 w-4" />}
        color="yellow"
      />
    </Timeline>
  ),
};

export const AlternateLayout: Story = {
  args: {
    orientation: "alternate",
  },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Company founded"
        description="Started with a team of 3 in a garage"
        timestamp="2019"
        color="accent"
        icon={<Star className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Seed funding"
        description="Raised $2M from angel investors"
        timestamp="2020"
        color="green"
        icon={<Check className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Product launch"
        description="First public release with 1,000 beta users"
        timestamp="2021"
        color="blue"
        icon={<Rocket className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Series A"
        description="Raised $15M to scale operations"
        timestamp="2022"
        color="green"
        icon={<Check className="h-4 w-4" />}
      />
      <Timeline.Item
        title="Global expansion"
        description="Opened offices in London and Tokyo"
        timestamp="2023"
        color="accent"
        icon={<Star className="h-4 w-4" />}
        active
      />
    </Timeline>
  ),
};

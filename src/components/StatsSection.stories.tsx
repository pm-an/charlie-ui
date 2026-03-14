import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatsSection } from "./StatsSection";

const meta: Meta<typeof StatsSection> = {
  title: "Blocks/Marketing/StatsSection",
  component: StatsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: {
    stats: [
      {
        label: "Active Users",
        value: "12.4K",
        change: 14.2,
        trend: "up",
      },
      {
        label: "Monthly Revenue",
        value: "842",
        prefix: "$",
        suffix: "K",
        change: 8.1,
        trend: "up",
      },
      {
        label: "Conversion Rate",
        value: "3.24",
        suffix: "%",
        change: -2.4,
        trend: "down",
      },
      {
        label: "Avg. Response Time",
        value: "145",
        suffix: "ms",
        change: 0,
        trend: "neutral",
      },
    ],
  },
};

export const Simple: Story = {
  args: {
    variant: "simple",
    stats: [
      { label: "Components", value: "100", suffix: "+" },
      { label: "GitHub Stars", value: "8.2K" },
      { label: "npm Downloads", value: "1.2M" },
    ],
  },
};

export const WithHeader: Story = {
  args: {
    eyebrow: "Performance",
    title: "Trusted by developers worldwide",
    description:
      "Charlie UI powers applications serving millions of users every day.",
    stats: [
      {
        label: "Active Users",
        value: "2.4M",
        change: 22,
        trend: "up",
      },
      {
        label: "Uptime",
        value: "99.99",
        suffix: "%",
      },
      {
        label: "API Requests",
        value: "4.8B",
        change: 18.3,
        trend: "up",
      },
      {
        label: "Avg. Latency",
        value: "12",
        suffix: "ms",
        change: -8,
        trend: "down",
      },
    ],
  },
};

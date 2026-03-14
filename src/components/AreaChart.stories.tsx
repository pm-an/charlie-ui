import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaChart } from "./AreaChart";

const meta: Meta<typeof AreaChart> = {
  title: "Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof AreaChart>;

const sampleData = [
  { month: "Jan", users: 2400, sessions: 4000 },
  { month: "Feb", users: 1398, sessions: 3000 },
  { month: "Mar", users: 3800, sessions: 5000 },
  { month: "Apr", users: 3908, sessions: 4780 },
  { month: "May", users: 4800, sessions: 5890 },
  { month: "Jun", users: 3800, sessions: 6390 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    areas: [{ dataKey: "users", color: "accent" }],
    xAxisKey: "month",
    "aria-label": "Monthly active users",
  },
};

export const MultiArea: Story = {
  args: {
    data: sampleData,
    areas: [
      { dataKey: "users", color: "accent", label: "Users" },
      { dataKey: "sessions", color: "blue", label: "Sessions" },
    ],
    xAxisKey: "month",
    showLegend: true,
    "aria-label": "Users vs sessions over time",
  },
};

export const Stacked: Story = {
  args: {
    data: sampleData,
    areas: [
      { dataKey: "users", color: "accent", label: "Users", stackId: "1" },
      { dataKey: "sessions", color: "purple", label: "Sessions", stackId: "1" },
    ],
    xAxisKey: "month",
    showLegend: true,
  },
};

export const HighFillOpacity: Story = {
  args: {
    data: sampleData,
    areas: [{ dataKey: "users", color: "green", fillOpacity: 0.4 }],
    xAxisKey: "month",
  },
};

export const LinearCurve: Story = {
  args: {
    data: sampleData,
    areas: [{ dataKey: "users", color: "accent" }],
    xAxisKey: "month",
    curveType: "linear",
  },
};

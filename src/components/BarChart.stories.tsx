import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const meta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof BarChart>;

const sampleData = [
  { name: "Mon", visits: 4000, unique: 2400 },
  { name: "Tue", visits: 3000, unique: 1398 },
  { name: "Wed", visits: 5000, unique: 3800 },
  { name: "Thu", visits: 4780, unique: 3908 },
  { name: "Fri", visits: 5890, unique: 4800 },
  { name: "Sat", visits: 3200, unique: 2100 },
  { name: "Sun", visits: 2900, unique: 1800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    bars: [{ dataKey: "visits", color: "accent" }],
    "aria-label": "Daily site visits",
  },
};

export const Grouped: Story = {
  args: {
    data: sampleData,
    bars: [
      { dataKey: "visits", color: "accent", label: "Total Visits" },
      { dataKey: "unique", color: "blue", label: "Unique Visitors" },
    ],
    showLegend: true,
    "aria-label": "Total vs unique visitors by day",
  },
};

export const Stacked: Story = {
  args: {
    data: sampleData,
    bars: [
      { dataKey: "unique", color: "accent", label: "Unique", stackId: "a" },
      { dataKey: "visits", color: "blue", label: "Returning", stackId: "a" },
    ],
    showLegend: true,
  },
};

export const Horizontal: Story = {
  args: {
    data: sampleData.slice(0, 5),
    bars: [{ dataKey: "visits", color: "green" }],
    layout: "vertical",
    height: 300,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: sampleData,
    bars: [{ dataKey: "visits", color: "purple" }],
    showGrid: false,
  },
};

export const RoundedBars: Story = {
  args: {
    data: sampleData,
    bars: [{ dataKey: "visits", color: "accent", radius: 8 }],
  },
};

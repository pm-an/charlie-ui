import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./LineChart";

const meta: Meta<typeof LineChart> = {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof LineChart>;

const sampleData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 5000, expenses: 3800 },
  { month: "Apr", revenue: 4780, expenses: 3908 },
  { month: "May", revenue: 5890, expenses: 4800 },
  { month: "Jun", revenue: 6390, expenses: 3800 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    lines: [{ dataKey: "revenue", color: "accent" }],
    xAxisKey: "month",
    "aria-label": "Monthly revenue trend",
  },
};

export const MultiLine: Story = {
  args: {
    data: sampleData,
    lines: [
      { dataKey: "revenue", color: "accent", label: "Revenue" },
      { dataKey: "expenses", color: "blue", label: "Expenses", dashed: true },
    ],
    xAxisKey: "month",
    showLegend: true,
    "aria-label": "Revenue vs expenses over time",
  },
};

export const WithoutGrid: Story = {
  args: {
    data: sampleData,
    lines: [{ dataKey: "revenue", color: "green" }],
    xAxisKey: "month",
    showGrid: false,
  },
};

export const StepCurve: Story = {
  args: {
    data: sampleData,
    lines: [{ dataKey: "revenue", color: "purple" }],
    xAxisKey: "month",
    curveType: "step",
  },
};

export const CustomHeight: Story = {
  args: {
    data: sampleData,
    lines: [{ dataKey: "revenue", color: "accent" }],
    xAxisKey: "month",
    height: 200,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./RadarChart";

const meta: Meta<typeof RadarChart> = {
  title: "Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof RadarChart>;

const skillData = [
  { subject: "Frontend", A: 90, B: 70 },
  { subject: "Backend", A: 75, B: 85 },
  { subject: "DevOps", A: 60, B: 90 },
  { subject: "Design", A: 85, B: 55 },
  { subject: "Testing", A: 70, B: 80 },
  { subject: "Security", A: 65, B: 75 },
];

export const Default: Story = {
  args: {
    data: skillData,
    radars: [{ dataKey: "A", color: "accent" }],
  },
};

export const Comparison: Story = {
  args: {
    data: skillData,
    radars: [
      { dataKey: "A", color: "accent", label: "Team Alpha" },
      { dataKey: "B", color: "blue", label: "Team Beta" },
    ],
    showLegend: true,
  },
};

export const HighFill: Story = {
  args: {
    data: skillData,
    radars: [{ dataKey: "A", color: "green", fillOpacity: 0.5 }],
  },
};

export const WithoutGrid: Story = {
  args: {
    data: skillData,
    radars: [{ dataKey: "A", color: "purple" }],
    showGrid: false,
  },
};

export const CustomHeight: Story = {
  args: {
    data: skillData,
    radars: [{ dataKey: "A", color: "accent" }],
    height: 400,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChart } from "./PieChart";

const meta: Meta<typeof PieChart> = {
  title: "Charts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof PieChart>;

const sampleData = [
  { name: "Desktop", value: 4500, color: "accent" },
  { name: "Mobile", value: 3200, color: "blue" },
  { name: "Tablet", value: 1200, color: "green" },
  { name: "Other", value: 400, color: "yellow" },
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const Donut: Story = {
  args: {
    data: sampleData,
    variant: "donut",
  },
};

export const DonutWithLabel: Story = {
  args: {
    data: sampleData,
    variant: "donut",
    label: "Total Devices",
    labelValue: "9,300",
  },
};

export const WithLabels: Story = {
  args: {
    data: sampleData,
    showLabels: true,
    showLegend: false,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: sampleData,
    showLegend: false,
  },
};

export const CustomColors: Story = {
  args: {
    data: [
      { name: "React", value: 60, color: "#61DAFB" },
      { name: "Vue", value: 25, color: "#42B883" },
      { name: "Angular", value: 15, color: "#DD0031" },
    ],
    variant: "donut",
    label: "Framework Share",
    labelValue: "100%",
  },
};

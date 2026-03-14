import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "circular"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["accent", "blue", "green", "yellow"],
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    showValue: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const WithValue: Story = {
  args: {
    value: 42,
    showValue: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("42%")).toBeVisible();
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: "Uploading files...",
    showValue: true,
  },
};

export const Small: Story = {
  args: {
    value: 30,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    value: 85,
    size: "lg",
    showValue: true,
  },
};

export const BlueColor: Story = {
  args: {
    value: 55,
    color: "blue",
    showValue: true,
  },
};

export const GreenColor: Story = {
  args: {
    value: 100,
    color: "green",
    showValue: true,
    label: "Upload complete",
  },
};

export const YellowColor: Story = {
  args: {
    value: 89,
    color: "yellow",
    showValue: true,
    label: "API quota usage",
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: "Processing...",
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    value: 72,
    showValue: true,
  },
};

export const CircularSmall: Story = {
  args: {
    variant: "circular",
    size: "sm",
    value: 50,
  },
};

export const CircularLarge: Story = {
  args: {
    variant: "circular",
    size: "lg",
    value: 88,
    showValue: true,
    color: "green",
    label: "Health score",
  },
};

export const CircularIndeterminate: Story = {
  args: {
    variant: "circular",
    indeterminate: true,
    color: "blue",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Linear variants */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-white/60">Linear</h3>
        <Progress value={60} color="accent" showValue />
        <Progress value={45} color="blue" showValue />
        <Progress value={80} color="green" showValue />
        <Progress value={30} color="yellow" showValue />
      </div>

      {/* Linear sizes */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-white/60">Sizes</h3>
        <Progress value={50} size="sm" />
        <Progress value={50} size="md" />
        <Progress value={50} size="lg" />
      </div>

      {/* Indeterminate */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-white/60">Indeterminate</h3>
        <Progress indeterminate />
        <Progress indeterminate color="blue" />
      </div>

      {/* Circular variants */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-white/60">Circular</h3>
        <div className="flex items-end gap-6">
          <Progress variant="circular" value={72} size="sm" />
          <Progress variant="circular" value={72} size="md" showValue />
          <Progress variant="circular" value={72} size="lg" showValue />
        </div>
      </div>

      {/* Circular colors */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-white/60">
          Circular colors
        </h3>
        <div className="flex items-center gap-6">
          <Progress variant="circular" value={65} color="accent" showValue />
          <Progress variant="circular" value={55} color="blue" showValue />
          <Progress variant="circular" value={90} color="green" showValue />
          <Progress variant="circular" value={35} color="yellow" showValue />
          <Progress variant="circular" indeterminate color="blue" />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("60%")).toBeVisible();
    await expect(canvas.getByText("45%")).toBeVisible();
    await expect(canvas.getByText("80%")).toBeVisible();
    await expect(canvas.getByText("30%")).toBeVisible();
  },
};

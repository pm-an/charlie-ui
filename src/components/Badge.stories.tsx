import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "red", "blue", "green", "yellow", "pro"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Selected",
  },
};

export const Red: Story = {
  args: {
    variant: "red",
    children: "Overdue",
  },
};

export const Blue: Story = {
  args: {
    variant: "blue",
    children: "In progress",
  },
};

export const Green: Story = {
  args: {
    variant: "green",
    children: "Completed",
  },
};

export const Yellow: Story = {
  args: {
    variant: "yellow",
    children: "Pending review",
  },
};

export const Pro: Story = {
  args: {
    variant: "pro",
    children: "PRO",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const MediumSize: Story = {
  args: {
    size: "md",
    children: "Medium",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Selected</Badge>
      <Badge variant="red">Overdue</Badge>
      <Badge variant="blue">In progress</Badge>
      <Badge variant="green">Completed</Badge>
      <Badge variant="yellow">Pending review</Badge>
      <Badge variant="pro">PRO</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Default")).toBeVisible();
    await expect(canvas.getByText("Selected")).toBeVisible();
    await expect(canvas.getByText("Overdue")).toBeVisible();
    await expect(canvas.getByText("In progress")).toBeVisible();
    await expect(canvas.getByText("Completed")).toBeVisible();
    await expect(canvas.getByText("Pending review")).toBeVisible();
    await expect(canvas.getByText("PRO")).toBeVisible();
  },
};

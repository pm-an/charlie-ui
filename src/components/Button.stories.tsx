import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger", "brand"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Get started",
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Get started" });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Get started",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Learn more",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Cancel",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Delete account",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    children: "Upgrade to Pro",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "Download",
    leftIcon: <Download className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Continue",
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Saving...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Saving/ });
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Unavailable",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Unavailable" });
    await expect(button).toBeDisabled();
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="brand">Brand</Button>
    </div>
  ),
};

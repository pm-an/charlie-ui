import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn, waitFor } from "storybook/test";
import { CopyButton } from "./CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "Primitives/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: "npm install @charlietogolden/charlie-ui",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await expect(button).toBeVisible();
    await expect(canvas.getByText("Copy")).toBeVisible();
  },
};

export const Ghost: Story = {
  args: {
    value: "npx create-charlie-app",
    variant: "ghost",
  },
};

export const Outline: Story = {
  args: {
    value: "sk-abc123def456",
    variant: "outline",
  },
};

export const IconOnly: Story = {
  args: {
    value: "https://charlie-ui.dev",
    iconOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy" });
    await expect(button).toBeVisible();
    // Should not show text label
    expect(canvas.queryByText("Copy")).toBeNull();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CopyButton value="small" size="sm" />
      <CopyButton value="medium" size="md" />
      <CopyButton value="large" size="lg" />
    </div>
  ),
};

export const CustomLabels: Story = {
  args: {
    value: "const x = 42;",
    label: "Copy code",
    copiedLabel: "Done!",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Copy code")).toBeVisible();
  },
};

export const WithCallback: Story = {
  args: {
    value: "export default config;",
    onCopy: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(args.onCopy).toHaveBeenCalledOnce();
    });
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delayMs: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] items-center justify-center">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Edit your profile settings",
    children: <Button variant="secondary">Hover me</Button>,
    delayMs: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Hover me" });
    await expect(trigger).toBeVisible();
    // Hover to show tooltip
    await userEvent.hover(trigger);
    const tooltip = await canvas.findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Edit your profile settings");
    // Unhover to hide
    await userEvent.unhover(trigger);
  },
};

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    side: "top",
    children: <Button variant="secondary">Top</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    side: "bottom",
    children: <Button variant="secondary">Bottom</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    side: "left",
    children: <Button variant="secondary">Left</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    side: "right",
    children: <Button variant="secondary">Right</Button>,
  },
};

export const AllSides: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Tooltip content="Top tooltip" side="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};

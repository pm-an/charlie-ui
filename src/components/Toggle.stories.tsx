import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Toggle } from "./Toggle";

/**
 * **Deprecated** — Toggle is now a re-export of Switch.
 * Use `<Switch>` directly for new code.
 */
const meta: Meta<typeof Toggle> = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: function ToggleStory() {
    const [checked, setChecked] = React.useState(false);
    return <Toggle checked={checked} onChange={setChecked} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

export const Uncontrolled: Story = {
  render: () => <Toggle defaultChecked={false} label="Enable notifications" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

export const WithLabel: Story = {
  render: function ToggleWithLabel() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="Enable notifications"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: "Feature unavailable",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toBeDisabled();
  },
};

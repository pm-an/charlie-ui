import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";
import { Field } from "./Field";

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: function SwitchStory() {
    const [checked, setChecked] = React.useState(false);
    return <Switch checked={checked} onChange={setChecked} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

export const WithLabel: Story = {
  render: function SwitchWithLabel() {
    const [checked, setChecked] = React.useState(true);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Enable notifications"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Enable notifications")).toBeVisible();
  },
};

export const WithDescription: Story = {
  render: function SwitchWithDescription() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Email digest"
        description="Receive a weekly summary of activity in your workspace"
      />
    );
  },
};

export const Small: Story = {
  render: function SwitchSmall() {
    const [checked, setChecked] = React.useState(true);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        size="sm"
        label="Compact switch"
      />
    );
  },
};

export const Large: Story = {
  render: function SwitchLarge() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        size="lg"
        label="Large switch"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: "Feature unavailable",
    description: "This feature is not available on your plan",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toBeDisabled();
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: "Always enabled",
  },
};

export const AllSizes: Story = {
  render: function SwitchAllSizes() {
    const [sm, setSm] = React.useState(true);
    const [md, setMd] = React.useState(true);
    const [lg, setLg] = React.useState(true);
    return (
      <div className="flex flex-col gap-4">
        <Switch checked={sm} onChange={setSm} size="sm" label="Small" />
        <Switch checked={md} onChange={setMd} size="md" label="Medium" />
        <Switch checked={lg} onChange={setLg} size="lg" label="Large" />
      </div>
    );
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Field label="Notifications" description="Enable push notifications" required>
        <Switch checked={checked} onChange={setChecked} label="Push notifications" />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Field label="Notifications" error errorMessage="This field is required.">
        <Switch checked={checked} onChange={setChecked} label="Push notifications" />
      </Field>
    );
  },
};

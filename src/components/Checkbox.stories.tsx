import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox";
import { Field } from "./Field";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: function CheckboxStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        label="Accept terms and conditions"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Email notifications",
  },
};

export const WithDescription: Story = {
  render: function CheckboxDescStory() {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        label="Marketing emails"
        description="Receive updates about new features and promotions"
      />
    );
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: "Select all items",
  },
};

export const WithError: Story = {
  args: {
    error: true,
    errorMessage: "You must accept the terms to continue",
    label: "I agree to the terms of service",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "This option is unavailable",
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: "Mandatory feature (always on)",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Small checkbox",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Large checkbox",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="sm" label="Small" checked />
      <Checkbox size="md" label="Medium (default)" checked />
      <Checkbox size="lg" label="Large" checked />
    </div>
  ),
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Field label="Terms" description="Accept to continue" required>
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label="I agree to the terms of service"
        />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Field label="Terms" error errorMessage="This field is required.">
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label="I agree to the terms of service"
        />
      </Field>
    );
  },
};

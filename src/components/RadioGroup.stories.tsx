import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { RadioGroup } from "./RadioGroup";
import { Field } from "./Field";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    label: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: function RadioGroupStory() {
    const [value, setValue] = React.useState("email");
    return (
      <RadioGroup
        name="contact"
        label="Preferred contact method"
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="phone" label="Phone" />
        <RadioGroup.Item value="sms" label="SMS" />
      </RadioGroup>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailRadio = canvas.getByLabelText("Email");
    const phoneRadio = canvas.getByLabelText("Phone");
    await expect(emailRadio).toBeChecked();
    await userEvent.click(phoneRadio);
    await expect(phoneRadio).toBeChecked();
    await expect(emailRadio).not.toBeChecked();
  },
};

export const Horizontal: Story = {
  render: function RadioGroupHorizontalStory() {
    const [value, setValue] = React.useState("monthly");
    return (
      <RadioGroup
        name="billing"
        label="Billing cycle"
        orientation="horizontal"
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Item value="monthly" label="Monthly" />
        <RadioGroup.Item value="yearly" label="Yearly" />
      </RadioGroup>
    );
  },
};

export const WithDescriptions: Story = {
  render: function RadioGroupDescStory() {
    const [value, setValue] = React.useState("starter");
    return (
      <RadioGroup
        name="plan"
        label="Choose a plan"
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Item
          value="starter"
          label="Starter"
          description="Best for personal projects and experiments"
        />
        <RadioGroup.Item
          value="pro"
          label="Pro"
          description="For professional developers and small teams"
        />
        <RadioGroup.Item
          value="enterprise"
          label="Enterprise"
          description="Custom solutions for large organisations"
        />
      </RadioGroup>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <RadioGroup
      name="tos"
      label="Agree to terms"
      error
      errorMessage="Please select an option before continuing"
    >
      <RadioGroup.Item value="agree" label="I agree" />
      <RadioGroup.Item value="disagree" label="I disagree" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup
      name="disabled-group"
      label="Disabled group"
      disabled
      value="a"
    >
      <RadioGroup.Item value="a" label="Option A" />
      <RadioGroup.Item value="b" label="Option B" />
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  render: function RadioGroupDisabledItemStory() {
    const [value, setValue] = React.useState("free");
    return (
      <RadioGroup
        name="tier"
        label="Select tier"
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Item value="free" label="Free" />
        <RadioGroup.Item
          value="premium"
          label="Premium (coming soon)"
          disabled
        />
        <RadioGroup.Item value="team" label="Team" />
      </RadioGroup>
    );
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [value, setValue] = React.useState("email");
    return (
      <Field label="Contact method" description="How should we reach you?" required>
        <RadioGroup name="contact-field" value={value} onChange={setValue}>
          <RadioGroup.Item value="email" label="Email" />
          <RadioGroup.Item value="phone" label="Phone" />
          <RadioGroup.Item value="sms" label="SMS" />
        </RadioGroup>
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: () => (
    <Field label="Contact method" error errorMessage="This field is required.">
      <RadioGroup name="contact-field-error">
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="phone" label="Phone" />
        <RadioGroup.Item value="sms" label="SMS" />
      </RadioGroup>
    </Field>
  ),
};

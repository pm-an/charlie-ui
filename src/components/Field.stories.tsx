import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Field> = {
  title: "Forms/Field",
  component: Field,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field label="Email address">
      <Input placeholder="you@example.com" />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field label="Email address" description="We'll never share your email with anyone.">
      <Input placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Email address" error errorMessage="Please enter a valid email address.">
      <Input placeholder="you@example.com" />
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field label="Full name" required>
      <Input placeholder="Jane Smith" />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Username" disabled>
      <Input placeholder="janesmith" disabled />
    </Field>
  ),
};

export const CompoundUsage: Story = {
  render: () => (
    <Field error errorMessage="This field is required">
      <Field.Label>Project name</Field.Label>
      <Field.Description>Choose a unique name for your project.</Field.Description>
      <Input placeholder="my-awesome-project" />
      <Field.Error>This field is required</Field.Error>
    </Field>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Field label="First name" required>
        <Input placeholder="Jane" />
      </Field>
      <Field label="Last name" required>
        <Input placeholder="Smith" />
      </Field>
      <Field label="Bio" description="Tell us about yourself.">
        <Textarea placeholder="I'm a software engineer who..." />
      </Field>
    </div>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <Field label="Country" required description="Select your country of residence.">
      <Select
        options={[
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
          { value: "au", label: "Australia" },
        ]}
        placeholder="Choose a country..."
      />
    </Field>
  ),
};

export const WithCheckbox: Story = {
  render: function CheckboxFieldStory() {
    const [checked, setChecked] = React.useState(false);
    return (
      <Field label="Notifications" description="Choose which notifications you'd like to receive.">
        <Checkbox
          checked={checked}
          onChange={() => setChecked(!checked)}
          label="Email notifications"
        />
      </Field>
    );
  },
};

export const FormExample: Story = {
  render: function FormExampleStory() {
    const [submitted, setSubmitted] = React.useState(false);
    return (
      <form
        className="space-y-4 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="Name" required>
          <Input placeholder="Jane Smith" />
        </Field>
        <Field label="Email" required description="Your work email.">
          <Input type="email" placeholder="jane@company.com" />
        </Field>
        <Field label="Message">
          <Textarea placeholder="How can we help?" />
        </Field>
        <button
          type="submit"
          className="w-full rounded-md px-4 h-10 text-sm font-medium bg-white/80 hover:bg-white text-[#18191a] transition-all"
        >
          {submitted ? "Sent!" : "Submit"}
        </button>
      </form>
    );
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

/**
 * @deprecated Use `Field` instead. See Forms/Field for the new API.
 *
 * `FormField` is now a compatibility alias for `Field`.
 * All existing usage continues to work, but new code should use `Field` directly.
 */
const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Email address" description="We'll never share your email.">
      <Input placeholder="you@example.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField
      label="Email address"
      error
      errorMessage="Please enter a valid email address."
      required
    >
      <Input placeholder="you@example.com" error />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Full name" required>
      <Input placeholder="Jane Smith" />
    </FormField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField label="Username" disabled>
      <Input placeholder="janesmith" disabled />
    </FormField>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormField label="Bio" description="Tell us about yourself (max 160 characters).">
      <Textarea placeholder="I'm a software engineer who..." maxLength={160} />
    </FormField>
  ),
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
        <FormField label="Name" required>
          <Input placeholder="Jane Smith" />
        </FormField>
        <FormField label="Email" required description="Your work email.">
          <Input type="email" placeholder="jane@company.com" />
        </FormField>
        <FormField label="Message">
          <Textarea placeholder="How can we help?" />
        </FormField>
        <Button type="submit">{submitted ? "Sent!" : "Submit"}</Button>
      </form>
    );
  },
};

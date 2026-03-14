import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Textarea } from "./Textarea";
import { Field } from "./Field";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    autoResize: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Write your message here...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Write your message here...");
    await expect(textarea).toBeVisible();
    await userEvent.click(textarea);
    await userEvent.type(textarea, "Hello, this is a test message.");
    await expect(textarea).toHaveValue("Hello, this is a test message.");
  },
};

export const WithLabel: Story = {
  args: {
    label: "Description",
    placeholder: "Describe your project in a few sentences",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("Description");
    await expect(textarea).toBeVisible();
    await userEvent.click(textarea);
    await expect(textarea).toHaveFocus();
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    helperText: "Maximum 280 characters",
  },
};

export const WithError: Story = {
  args: {
    label: "Feedback",
    placeholder: "Share your thoughts",
    defaultValue: "Hi",
    error: true,
    errorMessage: "Feedback must be at least 20 characters long",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Feedback must be at least 20 characters long")
    ).toBeVisible();
  },
};

export const AutoResize: Story = {
  render: function AutoResizeStory() {
    const [value, setValue] = React.useState("");
    return (
      <Textarea
        label="Notes"
        placeholder="Start typing and the textarea will grow..."
        autoResize
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const NoResize: Story = {
  args: {
    label: "Fixed size",
    placeholder: "This textarea cannot be resized",
    resize: "none",
  },
};

export const Disabled: Story = {
  args: {
    label: "Terms",
    defaultValue:
      "By using this service, you agree to our terms and conditions.",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("Terms");
    await expect(textarea).toBeDisabled();
  },
};

export const InsideField: Story = {
  render: () => (
    <Field label="Bio" description="Tell us a bit about yourself" required>
      <Textarea placeholder="Write something about yourself..." />
    </Field>
  ),
};

export const InsideFieldWithError: Story = {
  render: () => (
    <Field label="Bio" error errorMessage="This field is required.">
      <Textarea placeholder="Write something about yourself..." />
    </Field>
  ),
};

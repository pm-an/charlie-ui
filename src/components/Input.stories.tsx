import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Search } from "lucide-react";
import { Input } from "./Input";
import { Field } from "./Field";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter your email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your email");
    await expect(input).toBeVisible();
    await userEvent.click(input);
    await userEvent.type(input, "user@example.com");
    await expect(input).toHaveValue("user@example.com");
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Email address");
    await expect(input).toBeVisible();
    await userEvent.click(input);
    await expect(input).toHaveFocus();
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter a strong password",
    helperText: "Must be at least 8 characters long",
  },
};

export const WithError: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    defaultValue: "invalid-email",
    error: true,
    errorMessage: "Please enter a valid email address",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Please enter a valid email address")).toBeVisible();
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Search components...",
    leftIcon: <Search className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Organisation",
    defaultValue: "Acme Corp",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Organisation");
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("Acme Corp");
  },
};

export const InsideField: Story = {
  render: () => (
    <Field label="Email address" description="We'll never share your email" required>
      <Input placeholder="you@example.com" />
    </Field>
  ),
};

export const InsideFieldWithError: Story = {
  render: () => (
    <Field label="Email address" error errorMessage="This field is required.">
      <Input placeholder="you@example.com" />
    </Field>
  ),
};

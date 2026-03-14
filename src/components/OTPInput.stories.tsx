import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { OTPInput } from "./OTPInput";
import { Field } from "./Field";

const meta: Meta<typeof OTPInput> = {
  title: "Forms/OTPInput",
  component: OTPInput,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    type: {
      control: "select",
      options: ["numeric", "alphanumeric"],
    },
    length: { control: "number" },
    separator: { control: "number" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  args: {
    length: 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("otp-hidden-input");
    await expect(input).toBeInTheDocument();
    await expect(canvas.getAllByTestId(/^otp-slot-/)).toHaveLength(6);
  },
};

export const FourDigits: Story = {
  args: {
    length: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByTestId(/^otp-slot-/)).toHaveLength(4);
  },
};

export const WithLabel: Story = {
  args: {
    length: 6,
    label: "Verification Code",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Verification Code")).toBeVisible();
  },
};

export const WithSeparator: Story = {
  args: {
    length: 6,
    separator: 3,
    label: "Enter your 6-digit code",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Separator after slot 2 (index 2) = after 3rd digit
    await expect(canvas.getByTestId("otp-separator-2")).toBeInTheDocument();
  },
};

export const Alphanumeric: Story = {
  args: {
    length: 6,
    type: "alphanumeric",
    label: "Alphanumeric Code",
  },
};

export const Prefilled: Story = {
  args: {
    length: 6,
    defaultValue: "123456",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1")).toBeVisible();
    await expect(canvas.getByText("6")).toBeVisible();
  },
};

export const WithError: Story = {
  args: {
    length: 6,
    error: true,
    errorMessage: "Invalid verification code. Please try again.",
    defaultValue: "123456",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Invalid verification code. Please try again."),
    ).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    defaultValue: "847293",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("otp-hidden-input");
    await expect(input).toBeDisabled();
  },
};

export const SmallSize: Story = {
  args: {
    length: 6,
    size: "sm",
    label: "Small OTP Input",
  },
};

export const LargeSize: Story = {
  args: {
    length: 6,
    size: "lg",
    label: "Large OTP Input",
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState("");
    return (
      <div className="space-y-4">
        <OTPInput
          length={6}
          value={value}
          onChange={setValue}
          label="Controlled Input"
        />
        <p className="text-sm text-white/60">
          Current value: <code className="font-mono text-white">{value || "(empty)"}</code>
        </p>
      </div>
    );
  },
};

export const OnComplete: Story = {
  render: function OnCompleteStory() {
    const [completed, setCompleted] = React.useState<string | null>(null);
    return (
      <div className="space-y-4">
        <OTPInput
          length={4}
          label="Enter 4-digit PIN"
          onComplete={(code) => setCompleted(code)}
        />
        {completed && (
          <p className="text-sm text-green">
            Code submitted: <code className="font-mono">{completed}</code>
          </p>
        )}
      </div>
    );
  },
};

export const InsideField: Story = {
  render: () => (
    <Field label="Verification code" description="Enter the 6-digit code sent to your email" required>
      <OTPInput length={6} />
    </Field>
  ),
};

export const InsideFieldWithError: Story = {
  render: () => (
    <Field label="Verification code" error errorMessage="This field is required.">
      <OTPInput length={6} />
    </Field>
  ),
};

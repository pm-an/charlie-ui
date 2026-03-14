import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    htmlFor: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email address",
    htmlFor: "email",
  },
};

export const Required: Story = {
  args: {
    children: "Full name",
    htmlFor: "full-name",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Organisation (read-only)",
    htmlFor: "org",
    disabled: true,
  },
};

export const RequiredAndDisabled: Story = {
  args: {
    children: "API key",
    htmlFor: "api-key",
    required: true,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label htmlFor="default">Default label</Label>
      <Label htmlFor="required" required>
        Required label
      </Label>
      <Label htmlFor="disabled" disabled>
        Disabled label
      </Label>
      <Label htmlFor="both" required disabled>
        Required and disabled
      </Label>
    </div>
  ),
};

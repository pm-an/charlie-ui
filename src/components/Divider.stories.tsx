import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Primitives/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "dotted"],
    },
    label: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md py-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Solid: Story = {
  args: {
    variant: "solid",
  },
};

export const Dotted: Story = {
  args: {
    variant: "dotted",
  },
};

export const WithLabel: Story = {
  args: {
    label: "or continue with",
  },
};

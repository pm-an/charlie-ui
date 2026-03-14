import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckoutForm } from "./CheckoutForm";
import { fn } from "@storybook/test";

const meta: Meta<typeof CheckoutForm> = {
  title: "Blocks/Ecommerce/CheckoutForm",
  component: CheckoutForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[640px] p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CheckoutForm>;

export const Default: Story = {
  args: {
    onSubmit: fn(),
  },
};

export const StepTwo: Story = {
  args: {
    defaultStep: 1,
    onSubmit: fn(),
  },
};

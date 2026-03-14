import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

const meta: Meta<typeof ForgotPasswordForm> = {
  title: "Blocks/Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    loginHref: "#",
  },
};

export const WithLogo: Story = {
  args: {
    logo: (
      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-lg">
        C
      </div>
    ),
    loginHref: "#",
  },
};

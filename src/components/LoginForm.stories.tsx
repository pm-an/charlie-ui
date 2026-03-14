import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Github, Chrome } from "lucide-react";
import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Blocks/Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  args: {
    forgotPasswordHref: "#",
    signupHref: "#",
  },
};

export const WithSocialProviders: Story = {
  args: {
    forgotPasswordHref: "#",
    signupHref: "#",
    socialProviders: [
      {
        name: "GitHub",
        icon: <Github className="h-4 w-4" />,
        onClick: fn(),
      },
      {
        name: "Google",
        icon: <Chrome className="h-4 w-4" />,
        onClick: fn(),
      },
    ],
  },
};

export const WithLogo: Story = {
  args: {
    logo: (
      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-lg">
        C
      </div>
    ),
    forgotPasswordHref: "#",
    signupHref: "#",
  },
};

export const Minimal: Story = {
  args: {
    showRememberMe: false,
  },
};

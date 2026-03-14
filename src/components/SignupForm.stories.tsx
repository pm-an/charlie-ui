import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Github, Chrome } from "lucide-react";
import { SignupForm } from "./SignupForm";

const meta: Meta<typeof SignupForm> = {
  title: "Blocks/Auth/SignupForm",
  component: SignupForm,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    onSubmit: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {
  args: {
    loginHref: "#",
  },
};

export const WithSocialProviders: Story = {
  args: {
    loginHref: "#",
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
    loginHref: "#",
  },
};

export const Minimal: Story = {
  args: {
    showTerms: false,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnnouncementBar } from "./AnnouncementBar";
import { Megaphone, Sparkles, AlertTriangle, CheckCircle, Zap } from "lucide-react";

const meta: Meta<typeof AnnouncementBar> = {
  title: "Blocks/Marketing/AnnouncementBar",
  component: AnnouncementBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AnnouncementBar>;

export const Default: Story = {
  args: {
    message: "We just launched v2.0 with 50+ new components and a redesigned API.",
    variant: "default",
  },
};

export const Info: Story = {
  args: {
    message: "Scheduled maintenance on March 20th from 2:00 AM to 4:00 AM UTC.",
    variant: "info",
  },
};

export const Warning: Story = {
  args: {
    message: "API rate limits will be enforced starting next week. Review your usage.",
    variant: "warning",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
};

export const Success: Story = {
  args: {
    message: "Your account has been upgraded to the Pro plan. Enjoy all premium features!",
    variant: "success",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

export const Brand: Story = {
  args: {
    message: "Charlie UI is now open source. Star us on GitHub!",
    variant: "brand",
    icon: <Sparkles className="h-4 w-4" />,
  },
};

export const WithIcon: Story = {
  args: {
    message: "Big news: We just raised our Series A to build the future of developer tools.",
    variant: "default",
    icon: <Megaphone className="h-4 w-4" />,
  },
};

export const WithLink: Story = {
  args: {
    message: "Version 3.0 is here with dark mode, animations, and more.",
    href: "https://charlieui.com/changelog",
    linkText: "Learn more \u2192",
    variant: "brand",
    icon: <Zap className="h-4 w-4" />,
  },
};

export const NonDismissible: Story = {
  args: {
    message: "This site uses cookies to improve your experience.",
    variant: "default",
    dismissible: false,
  },
};

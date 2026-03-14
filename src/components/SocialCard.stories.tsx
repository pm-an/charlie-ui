import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialCard } from "./SocialCard";
import { Twitter, Github, MessageCircle, Rss } from "lucide-react";

const meta: Meta<typeof SocialCard> = {
  title: "Cards/SocialCard",
  component: SocialCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SocialCard>;

export const Red: Story = {
  args: {
    color: "red",
    icon: <Twitter className="w-8 h-8 text-red" />,
    title: "Follow us on Twitter",
    description:
      "Stay in the loop with the latest updates, tips, and community highlights.",
    href: "https://twitter.com",
  },
};

export const Blue: Story = {
  args: {
    color: "blue",
    icon: <Github className="w-8 h-8 text-blue" />,
    title: "Star us on GitHub",
    description:
      "Browse the source, report issues, and contribute to the project.",
    href: "https://github.com",
  },
};

export const Purple: Story = {
  args: {
    color: "purple",
    icon: <MessageCircle className="w-8 h-8 text-purple" />,
    title: "Join our Discord",
    description:
      "Chat with the team and community. Get help, share feedback, and hang out.",
    href: "https://discord.gg",
  },
};

export const Orange: Story = {
  args: {
    color: "orange",
    icon: <Rss className="w-8 h-8 text-orange" />,
    title: "Read the Blog",
    description:
      "Deep dives into component design, architecture decisions, and release notes.",
    href: "#blog",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      <SocialCard
        color="red"
        icon={<Twitter className="w-8 h-8 text-red" />}
        title="Follow us on Twitter"
        description="Stay in the loop with the latest updates and community highlights."
        href="https://twitter.com"
      />
      <SocialCard
        color="blue"
        icon={<Github className="w-8 h-8 text-blue" />}
        title="Star us on GitHub"
        description="Browse the source, report issues, and contribute to the project."
        href="https://github.com"
      />
    </div>
  ),
};

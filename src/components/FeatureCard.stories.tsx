import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeatureCard } from "./FeatureCard";
import { Zap, Shield, Globe } from "lucide-react";

const meta: Meta<typeof FeatureCard> = {
  title: "Cards/FeatureCard",
  component: FeatureCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Lightning Fast",
    description:
      "Optimised for speed with sub-millisecond response times. Every interaction feels instant, keeping your team in flow.",
  },
};

export const Small: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Lightning Fast",
    description:
      "Optimised for speed with sub-millisecond response times.",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    icon: <Shield className="h-5 w-5" />,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified with end-to-end encryption. Your data stays yours, always.",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    icon: <Globe className="h-5 w-5" />,
    title: "Global Edge Network",
    description:
      "Deployed across 40+ regions worldwide. Content is served from the edge node closest to your users for minimal latency.",
    size: "lg",
    image: "https://picsum.photos/seed/feature/600/300",
  },
};

export const WithGlow: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Lightning Fast",
    description:
      "Optimised for speed with sub-millisecond response times. Hover over this card to see the glow effect.",
    glow: true,
  },
};

export const IconCenter: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Lightning Fast",
    description:
      "Optimised for speed with sub-millisecond response times. Every interaction feels instant.",
    iconAlign: "center",
  },
};

export const IconRight: Story = {
  args: {
    icon: <Shield className="h-5 w-5" />,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified with end-to-end encryption. Your data stays yours, always.",
    iconAlign: "right",
  },
};

export const CenteredIconLeftText: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Mixed Alignment",
    description:
      "Icon is centered but text stays left-aligned. Useful for marketing layouts.",
    iconAlign: "center",
    textAlign: "left",
  },
};

export const TextCenter: Story = {
  args: {
    icon: <Zap className="h-5 w-5" />,
    title: "Centered Text",
    description:
      "Text is centered while icon stays on the left. Independent alignment controls.",
    textAlign: "center",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FeatureCard
        icon={<Zap className="h-5 w-5" />}
        title="Lightning Fast"
        description="Optimised for speed with sub-millisecond response times. Every interaction feels instant."
      />
      <FeatureCard
        icon={<Shield className="h-5 w-5" />}
        title="Enterprise Security"
        description="SOC 2 Type II certified with end-to-end encryption. Your data stays yours, always."
        iconAlign="center"
      />
      <FeatureCard
        icon={<Globe className="h-5 w-5" />}
        title="Global Edge Network"
        description="Deployed across 40+ regions worldwide for minimal latency no matter where your users are."
        iconAlign="right"
      />
    </div>
  ),
};

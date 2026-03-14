import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeatureSection } from "./FeatureSection";
import {
  Zap,
  Shield,
  BarChart3,
  Globe,
  Lock,
  Layers,
  Cpu,
  Palette,
} from "lucide-react";

const meta: Meta<typeof FeatureSection> = {
  title: "Blocks/Marketing/FeatureSection",
  component: FeatureSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FeatureSection>;

const sixFeatures = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Lightning Fast Builds",
    description:
      "Compile and deploy your projects in seconds with our optimized build pipeline. No more waiting around for CI.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified with end-to-end encryption, role-based access controls, and audit logging out of the box.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Real-time Analytics",
    description:
      "Monitor performance metrics, user behavior, and conversion funnels with dashboards that update in real time.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Global Edge Network",
    description:
      "Serve your content from 200+ edge locations worldwide. Sub-50ms latency for 95% of your users, guaranteed.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Access Management",
    description:
      "Fine-grained permissions with SSO, SAML, and SCIM support. Manage teams of any size without the overhead.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Version Control",
    description:
      "Built-in branching, preview deployments, and instant rollbacks. Ship with confidence knowing you can undo anything.",
  },
];

export const Grid: Story = {
  args: {
    eyebrow: "Features",
    title: "Everything you need to ship faster",
    description:
      "A comprehensive platform designed for modern engineering teams. Build, iterate, and deploy with confidence.",
    features: sixFeatures,
    variant: "grid",
    columns: 3,
  },
};

const alternatingFeatures = [
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Automated Infrastructure",
    description:
      "Provision servers, databases, and networking with a single command. Our platform auto-scales based on traffic patterns so you never over-pay or under-serve your users.",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Infrastructure",
    href: "#",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Intelligent Monitoring",
    description:
      "Get alerted before issues reach your users. Machine learning models analyze your metrics and predict incidents up to 30 minutes before they occur.",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Monitoring",
    href: "#",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Design System Integration",
    description:
      "Sync your Figma tokens directly to code. Every component stays in sync with your design system, eliminating drift between design and implementation.",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Design+System",
    href: "#",
  },
];

export const Alternating: Story = {
  args: {
    eyebrow: "Platform",
    title: "Built for scale",
    description:
      "From startup to enterprise, our platform grows with your team.",
    features: alternatingFeatures,
    variant: "alternating",
  },
};

export const TwoColumns: Story = {
  args: {
    eyebrow: "Core",
    title: "Two-column layout",
    description: "A compact feature grid for highlighting key capabilities.",
    features: sixFeatures.slice(0, 4),
    variant: "grid",
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    eyebrow: "Highlights",
    title: "Four-column layout",
    description: "Show more features at a glance with a wider grid.",
    features: [
      ...sixFeatures,
      {
        icon: <Cpu className="h-5 w-5" />,
        title: "Auto Scaling",
        description:
          "Automatically scales compute resources up and down based on real-time demand, keeping costs predictable.",
      },
      {
        icon: <Palette className="h-5 w-5" />,
        title: "Custom Themes",
        description:
          "Full design token support lets you match your brand perfectly. Dark mode, light mode, or anything in between.",
      },
    ],
    variant: "grid",
    columns: 4,
  },
};

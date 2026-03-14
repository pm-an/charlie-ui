import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntegrationsSection } from "./IntegrationsSection";
import type { Integration } from "./IntegrationsSection";
import {
  MessageSquare,
  Github,
  Figma,
  FileText,
  Trello,
  Slack,
  Mail,
  Cloud,
  Database,
  Lock,
  BarChart3,
  Globe,
} from "lucide-react";

const meta: Meta<typeof IntegrationsSection> = {
  title: "Blocks/Marketing/IntegrationsSection",
  component: IntegrationsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof IntegrationsSection>;

const defaultIntegrations: Integration[] = [
  {
    name: "Slack",
    icon: <Slack className="h-6 w-6" />,
    description: "Get notifications and updates directly in your channels.",
    href: "https://slack.com",
  },
  {
    name: "GitHub",
    icon: <Github className="h-6 w-6" />,
    description: "Sync issues, PRs, and deployments automatically.",
    href: "https://github.com",
  },
  {
    name: "Figma",
    icon: <Figma className="h-6 w-6" />,
    description: "Import designs and sync tokens from your Figma files.",
    href: "https://figma.com",
  },
  {
    name: "Notion",
    icon: <FileText className="h-6 w-6" />,
    description: "Connect docs and wikis for seamless knowledge sharing.",
    href: "https://notion.so",
  },
  {
    name: "Trello",
    icon: <Trello className="h-6 w-6" />,
    description: "Sync boards and cards with your project workflow.",
  },
  {
    name: "Gmail",
    icon: <Mail className="h-6 w-6" />,
    description: "Send and receive email notifications from your inbox.",
  },
  {
    name: "Vercel",
    icon: <Cloud className="h-6 w-6" />,
    description: "Deploy previews and production builds automatically.",
  },
  {
    name: "Discord",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Community updates and bot notifications in Discord.",
  },
];

export const Default: Story = {
  args: {
    eyebrow: "Integrations",
    title: "Connect your favorite tools",
    description:
      "Seamlessly integrate with the tools your team already uses. Set up in minutes, not hours.",
    integrations: defaultIntegrations,
  },
};

const categorizedIntegrations: Integration[] = [
  {
    name: "Slack",
    icon: <Slack className="h-6 w-6" />,
    description: "Real-time notifications in channels.",
    category: "Communication",
    href: "https://slack.com",
  },
  {
    name: "Discord",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Community updates and alerts.",
    category: "Communication",
  },
  {
    name: "Gmail",
    icon: <Mail className="h-6 w-6" />,
    description: "Email notifications and digests.",
    category: "Communication",
  },
  {
    name: "GitHub",
    icon: <Github className="h-6 w-6" />,
    description: "Sync issues, PRs, and deployments.",
    category: "Development",
    href: "https://github.com",
  },
  {
    name: "Vercel",
    icon: <Cloud className="h-6 w-6" />,
    description: "Auto-deploy previews and production.",
    category: "Development",
  },
  {
    name: "Supabase",
    icon: <Database className="h-6 w-6" />,
    description: "Database and auth integration.",
    category: "Development",
  },
  {
    name: "Figma",
    icon: <Figma className="h-6 w-6" />,
    description: "Import designs and sync tokens.",
    category: "Design",
    href: "https://figma.com",
  },
  {
    name: "Notion",
    icon: <FileText className="h-6 w-6" />,
    description: "Docs and knowledge base sync.",
    category: "Design",
    href: "https://notion.so",
  },
  {
    name: "Auth0",
    icon: <Lock className="h-6 w-6" />,
    description: "Single sign-on and identity management.",
    category: "Development",
  },
  {
    name: "Mixpanel",
    icon: <BarChart3 className="h-6 w-6" />,
    description: "Product analytics and event tracking.",
    category: "Design",
  },
  {
    name: "Trello",
    icon: <Trello className="h-6 w-6" />,
    description: "Board and card sync for projects.",
    category: "Communication",
  },
  {
    name: "Cloudflare",
    icon: <Globe className="h-6 w-6" />,
    description: "CDN, DNS, and edge functions.",
    category: "Development",
  },
];

export const WithCategories: Story = {
  args: {
    eyebrow: "Ecosystem",
    title: "Works with your stack",
    description:
      "Browse integrations by category. One-click setup with the platforms your team relies on.",
    integrations: categorizedIntegrations,
    showCategories: true,
  },
};

const minimalIntegrations: Integration[] = [
  {
    name: "Slack",
    icon: <Slack className="h-6 w-6" />,
  },
  {
    name: "GitHub",
    icon: <Github className="h-6 w-6" />,
  },
  {
    name: "Figma",
    icon: <Figma className="h-6 w-6" />,
  },
  {
    name: "Notion",
    icon: <FileText className="h-6 w-6" />,
  },
];

export const Minimal: Story = {
  args: {
    title: "Trusted by teams using",
    integrations: minimalIntegrations,
  },
};

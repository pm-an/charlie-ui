import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComparisonTable } from "./ComparisonTable";

const meta: Meta<typeof ComparisonTable> = {
  title: "Blocks/Marketing/ComparisonTable",
  component: ComparisonTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-bg p-8 md:p-12 max-w-[1280px] mx-auto">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const Default: Story = {
  args: {
    title: "Compare plans",
    description: "Choose the plan that fits your team's needs.",
    plans: [
      { name: "Starter", price: "$0", period: "month", cta: "Get started" },
      {
        name: "Pro",
        price: "$29",
        period: "month",
        highlighted: true,
        cta: "Start free trial",
      },
      { name: "Enterprise", price: "$99", period: "month", cta: "Contact sales" },
    ],
    features: [
      { name: "Team members", category: "Collaboration", values: ["Up to 3", "Up to 20", "Unlimited"] },
      { name: "Shared workspaces", category: "Collaboration", values: [true, true, true] },
      { name: "Guest access", category: "Collaboration", values: [false, true, true] },
      { name: "File storage", category: "Storage", values: ["1 GB", "50 GB", "Unlimited"] },
      { name: "Version history", category: "Storage", values: ["7 days", "90 days", "Unlimited"] },
      { name: "API access", category: "Storage", values: [false, true, true] },
      { name: "Custom domains", category: "Platform", values: [false, true, true] },
      { name: "SSO / SAML", category: "Platform", values: [false, false, true] },
      { name: "Priority support", category: "Support", values: [false, true, true] },
      { name: "Dedicated account manager", category: "Support", values: [false, false, true] },
    ],
  },
};

export const Simple: Story = {
  args: {
    plans: [
      { name: "Free", price: "$0", period: "month", cta: "Get started" },
      {
        name: "Premium",
        price: "$12",
        period: "month",
        highlighted: true,
        cta: "Upgrade now",
      },
    ],
    features: [
      { name: "Projects", values: ["3", "Unlimited"] },
      { name: "Storage", values: ["500 MB", "100 GB"] },
      { name: "Collaboration", values: [true, true] },
      { name: "Custom branding", values: [false, true] },
      { name: "Analytics", values: [false, true] },
    ],
  },
};

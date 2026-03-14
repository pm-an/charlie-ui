import type { Meta, StoryObj } from "@storybook/react-vite";
import { PricingSection } from "./PricingSection";

const meta: Meta<typeof PricingSection> = {
  title: "Blocks/Marketing/PricingSection",
  component: PricingSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof PricingSection>;

const defaultPlans = [
  {
    tier: "Starter",
    price: "$0",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "month",
    description:
      "Perfect for side projects and experiments. Get started for free with generous limits.",
    features: [
      "Up to 3 projects",
      "1 GB storage",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get started free",
  },
  {
    tier: "Pro",
    price: "$29",
    monthlyPrice: "$29",
    annualPrice: "$24",
    period: "month",
    description:
      "For growing teams that need more power, collaboration tools, and priority support.",
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom domains",
      "Team collaboration",
    ],
    cta: "Start free trial",
    highlighted: true,
    badge: "Most popular",
  },
  {
    tier: "Enterprise",
    price: "$99",
    monthlyPrice: "$99",
    annualPrice: "$79",
    period: "month",
    description:
      "For organizations with advanced security, compliance, and support requirements.",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "24/7 phone support",
      "SSO & SAML",
      "Audit logging",
      "Custom SLA",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
  },
];

export const Default: Story = {
  args: {
    eyebrow: "Pricing",
    title: "Simple, transparent pricing",
    description:
      "No hidden fees, no surprises. Pick the plan that fits your team and scale as you grow.",
    plans: defaultPlans,
  },
};

export const WithHighlighted: Story = {
  args: {
    eyebrow: "Plans",
    title: "Choose your plan",
    description:
      "Start free and upgrade when you are ready. All plans include a 14-day trial.",
    plans: [
      {
        ...defaultPlans[0],
        highlighted: false,
      },
      {
        ...defaultPlans[1],
        highlighted: true,
        badge: "Recommended",
      },
      {
        ...defaultPlans[2],
        highlighted: false,
      },
    ],
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import { PricingCard } from "./PricingCard";

const meta: Meta<typeof PricingCard> = {
  title: "Cards/PricingCard",
  component: PricingCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Free: Story = {
  args: {
    tier: "Free",
    price: "$0",
    period: "month",
    description: "For individuals and small side projects getting started.",
    features: [
      "Up to 3 projects",
      "1 GB storage",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
  },
};

export const Pro: Story = {
  args: {
    tier: "Pro",
    price: "$8",
    period: "month",
    description: "For professionals who need advanced tooling and priority support.",
    features: [
      "Unlimited projects",
      "50 GB storage",
      "Priority email support",
      "Advanced analytics",
      "Custom domains",
      "Team collaboration",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Popular",
    annualPrice: "$12/mo billed monthly",
    onCtaClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Pro")).toBeVisible();
    await expect(canvas.getByText("$8")).toBeVisible();
    await expect(canvas.getByText("Popular")).toBeVisible();
    await expect(canvas.getByText("Unlimited projects")).toBeVisible();
    await expect(canvas.getByText("Team collaboration")).toBeVisible();
    const ctaButton = canvas.getByRole("button", { name: "Upgrade to Pro" });
    await userEvent.click(ctaButton);
    await expect(args.onCtaClick).toHaveBeenCalledOnce();
  },
};

export const Team: Story = {
  args: {
    tier: "Team",
    price: "$24",
    period: "user / month",
    description: "For growing teams that need admin controls and compliance.",
    features: [
      "Everything in Pro",
      "500 GB storage",
      "SSO / SAML",
      "Audit logs",
      "Role-based access control",
      "Dedicated account manager",
      "99.99% SLA",
    ],
    cta: "Contact Sales",
  },
};

export const PricingGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
      <PricingCard
        tier="Free"
        price="$0"
        period="month"
        description="For individuals and small side projects getting started."
        features={[
          "Up to 3 projects",
          "1 GB storage",
          "Community support",
          "Basic analytics",
        ]}
        cta="Get Started"
      />
      <PricingCard
        tier="Pro"
        price="$8"
        period="month"
        description="For professionals who need advanced tooling and priority support."
        features={[
          "Unlimited projects",
          "50 GB storage",
          "Priority email support",
          "Advanced analytics",
          "Custom domains",
          "Team collaboration",
        ]}
        cta="Upgrade to Pro"
        highlighted
        badge="Popular"
        annualPrice="$12/mo billed monthly"
      />
      <PricingCard
        tier="Team"
        price="$24"
        period="user / month"
        description="For growing teams that need admin controls and compliance."
        features={[
          "Everything in Pro",
          "500 GB storage",
          "SSO / SAML",
          "Audit logs",
          "Role-based access control",
          "Dedicated account manager",
          "99.99% SLA",
        ]}
        cta="Contact Sales"
      />
    </div>
  ),
};

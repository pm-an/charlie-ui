import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PricingSection } from "../PricingSection";
import { expectNoA11yViolations } from "../../test/a11y";

const mockPlans = [
  {
    tier: "Starter",
    price: "$0",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "month",
    description: "Free for individuals",
    features: ["3 projects", "1 GB storage"],
    cta: "Get started",
  },
  {
    tier: "Pro",
    price: "$29",
    monthlyPrice: "$29",
    annualPrice: "$24",
    period: "month",
    description: "For growing teams",
    features: ["Unlimited projects", "100 GB storage"],
    cta: "Start trial",
    highlighted: true,
    badge: "Popular",
  },
  {
    tier: "Enterprise",
    price: "$99",
    monthlyPrice: "$99",
    annualPrice: "$79",
    period: "month",
    description: "For large organizations",
    features: ["Everything in Pro", "Unlimited storage"],
    cta: "Contact sales",
  },
];

const plansWithoutToggle = [
  {
    tier: "Basic",
    price: "$10",
    period: "month",
    description: "Simple plan",
    features: ["Feature A"],
    cta: "Buy now",
  },
];

describe("PricingSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <PricingSection plans={mockPlans} />
      );
      expect(
        container.querySelector("[data-slot='pricing-section']")
      ).toBeInTheDocument();
    });

    it("renders all pricing cards", () => {
      const { container } = render(
        <PricingSection plans={mockPlans} />
      );
      const cards = container.querySelectorAll("[data-slot='pricing-card']");
      expect(cards.length).toBe(3);
    });

    it("renders tier names", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
      expect(screen.getByText("Enterprise")).toBeInTheDocument();
    });

    it("renders descriptions", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("Free for individuals")).toBeInTheDocument();
      expect(screen.getByText("For growing teams")).toBeInTheDocument();
    });

    it("renders CTA buttons", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("Get started")).toBeInTheDocument();
      expect(screen.getByText("Start trial")).toBeInTheDocument();
      expect(screen.getByText("Contact sales")).toBeInTheDocument();
    });
  });

  describe("section header", () => {
    it("renders eyebrow when provided", () => {
      render(
        <PricingSection plans={mockPlans} eyebrow="Pricing" />
      );
      expect(screen.getByText("Pricing")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <PricingSection plans={mockPlans} title="Our plans" />
      );
      expect(screen.getByText("Our plans")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <PricingSection
          plans={mockPlans}
          description="Pick a plan"
        />
      );
      expect(screen.getByText("Pick a plan")).toBeInTheDocument();
    });

    it("does not render header elements when not provided", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.queryByText("Pricing")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <PricingSection plans={mockPlans} className="custom-class" />
      );
      expect(
        container.querySelector("[data-slot='pricing-section']")
      ).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<PricingSection ref={ref} plans={mockPlans} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <PricingSection plans={mockPlans} data-testid="my-pricing" />
      );
      expect(screen.getByTestId("my-pricing")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <PricingSection plans={mockPlans} />
      );
      expect(
        container.querySelector("[data-slot='pricing-section']")
      ).toBeInTheDocument();
    });
  });

  describe("billing toggle", () => {
    it("renders billing toggle when plans have monthlyPrice and annualPrice", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(
        screen.getByRole("switch", { name: "Toggle billing period" })
      ).toBeInTheDocument();
    });

    it("does not render billing toggle when plans lack monthly/annual prices", () => {
      render(<PricingSection plans={plansWithoutToggle} />);
      expect(
        screen.queryByRole("switch", { name: "Toggle billing period" })
      ).not.toBeInTheDocument();
    });

    it("shows monthly prices by default", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("$29")).toBeInTheDocument();
      expect(screen.getByText("$99")).toBeInTheDocument();
    });

    it("switches to annual prices when toggled", () => {
      render(<PricingSection plans={mockPlans} />);
      const toggle = screen.getByRole("switch", {
        name: "Toggle billing period",
      });
      fireEvent.click(toggle);
      expect(screen.getByText("$24")).toBeInTheDocument();
      expect(screen.getByText("$79")).toBeInTheDocument();
    });

    it("switches back to monthly when toggled twice", () => {
      render(<PricingSection plans={mockPlans} />);
      const toggle = screen.getByRole("switch", {
        name: "Toggle billing period",
      });
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(screen.getByText("$29")).toBeInTheDocument();
      expect(screen.getByText("$99")).toBeInTheDocument();
    });

    it("renders custom billing labels", () => {
      render(
        <PricingSection
          plans={mockPlans}
          billingLabel={{ monthly: "Pay monthly", annual: "Pay yearly" }}
        />
      );
      expect(screen.getByText("Pay monthly")).toBeInTheDocument();
      expect(screen.getByText("Pay yearly")).toBeInTheDocument();
    });

    it("renders default billing labels", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("Monthly")).toBeInTheDocument();
      expect(screen.getByText("Annual")).toBeInTheDocument();
    });

    it("toggle has correct aria-checked state", () => {
      render(<PricingSection plans={mockPlans} />);
      const toggle = screen.getByRole("switch", {
        name: "Toggle billing period",
      });
      expect(toggle).toHaveAttribute("aria-checked", "false");
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("highlighted plan", () => {
    it("renders badge on highlighted plan", () => {
      render(<PricingSection plans={mockPlans} />);
      expect(screen.getByText("Popular")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders with empty plans array", () => {
      const { container } = render(<PricingSection plans={[]} />);
      expect(
        container.querySelector("[data-slot='pricing-section']")
      ).toBeInTheDocument();
    });

    it("renders with single plan", () => {
      render(<PricingSection plans={[mockPlans[0]]} />);
      expect(screen.getByText("Starter")).toBeInTheDocument();
    });

    it("renders plans without toggle prices using static price", () => {
      render(<PricingSection plans={plansWithoutToggle} />);
      expect(screen.getByText("$10")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = render(
        <PricingSection plans={mockPlans} title="Our plans" />
      );
      await expectNoA11yViolations(container);
    });
  });
});

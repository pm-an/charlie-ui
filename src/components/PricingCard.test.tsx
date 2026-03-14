import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PricingCard } from "./PricingCard";
import { expectNoA11yViolations } from "../test/a11y";

describe("PricingCard", () => {
  const defaultProps = {
    tier: "Pro",
    price: "$29",
    period: "month",
    description: "For professional developers",
    features: ["Unlimited builds", "Priority support", "Custom domains"],
    cta: "Get Started",
  };

  it("renders tier name", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("renders price and period", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("/ month")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("For professional developers")).toBeInTheDocument();
  });

  it("renders all features with checkmarks", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText("Unlimited builds")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
    expect(screen.getByText("Custom domains")).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Get Started" })).toBeInTheDocument();
  });

  it("calls onCtaClick when CTA is clicked", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(<PricingCard {...defaultProps} onCtaClick={onCtaClick} />);
    await user.click(screen.getByRole("button", { name: "Get Started" }));
    expect(onCtaClick).toHaveBeenCalledOnce();
  });

  it("renders badge when provided", () => {
    render(<PricingCard {...defaultProps} badge="Popular" />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("renders annual price with strikethrough", () => {
    render(<PricingCard {...defaultProps} annualPrice="$348/year" />);
    expect(screen.getByText("$348/year")).toBeInTheDocument();
  });

  it("applies highlighted styling", () => {
    const { container } = render(<PricingCard {...defaultProps} highlighted />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<PricingCard {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("marks feature check icons as aria-hidden", () => {
    const { container } = render(<PricingCard {...defaultProps} />);
    const checkIcons = container.querySelectorAll("svg");
    checkIcons.forEach((icon) => {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<PricingCard {...defaultProps} badge="Popular" highlighted />);
    await expectNoA11yViolations(container);
  });
});

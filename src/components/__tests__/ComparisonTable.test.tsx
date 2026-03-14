import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComparisonTable } from "../ComparisonTable";

const defaultPlans = [
  { name: "Free", price: "$0", period: "month", cta: "Get started" },
  { name: "Pro", price: "$29", period: "month", highlighted: true, cta: "Start trial" },
];

const defaultFeatures = [
  { name: "Storage", values: ["1 GB", "50 GB"] as (boolean | string)[] },
  { name: "API access", values: [false, true] as (boolean | string)[] },
];

describe("ComparisonTable", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(
        <ComparisonTable
          data-testid="table"
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(screen.getByTestId("table")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(
        <ComparisonTable
          data-testid="table"
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(screen.getByTestId("table")).toHaveAttribute("data-slot", "comparison-table");
    });

    it("applies custom className", () => {
      render(
        <ComparisonTable
          className="custom-class"
          data-testid="table"
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(screen.getByTestId("table")).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <ComparisonTable
          ref={ref}
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("title and description", () => {
    it("renders title when provided", () => {
      render(
        <ComparisonTable
          title="Compare plans"
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(screen.getByText("Compare plans")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <ComparisonTable
          description="Choose the best plan"
          plans={defaultPlans}
          features={defaultFeatures}
        />
      );
      expect(screen.getByText("Choose the best plan")).toBeInTheDocument();
    });

    it("does not render header when no title or description", () => {
      const { container } = render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(container.querySelector(".mb-8")).not.toBeInTheDocument();
    });
  });

  describe("plans", () => {
    it("renders plan names in header", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByText("Free")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    it("renders plan prices", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByText("$0")).toBeInTheDocument();
      expect(screen.getByText("$29")).toBeInTheDocument();
    });

    it("renders plan periods", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      const periods = screen.getAllByText("/ month");
      expect(periods).toHaveLength(2);
    });

    it("renders CTA buttons", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByText("Get started")).toBeInTheDocument();
      expect(screen.getByText("Start trial")).toBeInTheDocument();
    });

    it("calls onCtaClick when CTA is clicked", () => {
      const onClick = vi.fn();
      const plans = [
        { name: "Free", cta: "Click me", onCtaClick: onClick },
      ];
      render(
        <ComparisonTable plans={plans} features={[{ name: "F1", values: [true] }]} />
      );
      fireEvent.click(screen.getByText("Click me"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("features", () => {
    it("renders feature names", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByText("Storage")).toBeInTheDocument();
      expect(screen.getByText("API access")).toBeInTheDocument();
    });

    it("renders string values", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByText("1 GB")).toBeInTheDocument();
      expect(screen.getByText("50 GB")).toBeInTheDocument();
    });

    it("renders boolean true as check icon", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByLabelText("Included")).toBeInTheDocument();
    });

    it("renders boolean false as X icon", () => {
      render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      expect(screen.getByLabelText("Not included")).toBeInTheDocument();
    });
  });

  describe("categories", () => {
    it("renders category headers when features have categories", () => {
      const features = [
        { name: "Storage", category: "Platform", values: ["1 GB", "5 GB"] as (boolean | string)[] },
        { name: "Support", category: "Services", values: [true, true] as (boolean | string)[] },
      ];
      render(
        <ComparisonTable plans={defaultPlans} features={features} />
      );
      expect(screen.getByText("Platform")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
    });

    it("does not render category headers when no categories", () => {
      const { container } = render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      const categoryHeaders = container.querySelectorAll(".uppercase.tracking-wider");
      expect(categoryHeaders).toHaveLength(0);
    });
  });

  describe("highlighted plan", () => {
    it("applies highlighted styles to the correct column header", () => {
      const { container } = render(
        <ComparisonTable plans={defaultPlans} features={defaultFeatures} />
      );
      const thElements = container.querySelectorAll("th");
      // Second plan (index 2, because first th is empty) is highlighted
      expect(thElements[2]).toHaveClass("bg-white/[0.02]");
    });
  });

  describe("edge cases", () => {
    it("renders with plans having no price", () => {
      const plans = [{ name: "Custom", cta: "Contact us" }];
      render(
        <ComparisonTable
          plans={plans}
          features={[{ name: "Feature", values: [true] }]}
        />
      );
      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.getByText("Contact us")).toBeInTheDocument();
    });

    it("renders with plans having no CTA", () => {
      const plans = [{ name: "Basic" }];
      render(
        <ComparisonTable
          plans={plans}
          features={[{ name: "Feature", values: ["Yes"] }]}
        />
      );
      expect(screen.getByText("Basic")).toBeInTheDocument();
    });

    it("spreads additional HTML attributes", () => {
      render(
        <ComparisonTable
          plans={defaultPlans}
          features={defaultFeatures}
          aria-label="Plan comparison"
          data-testid="table"
        />
      );
      expect(screen.getByTestId("table")).toHaveAttribute("aria-label", "Plan comparison");
    });
  });
});

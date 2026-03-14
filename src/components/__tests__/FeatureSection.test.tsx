import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FeatureSection } from "../FeatureSection";
import { expectNoA11yViolations } from "../../test/a11y";

const mockFeatures = [
  {
    icon: <span data-testid="icon-1">I1</span>,
    title: "Feature One",
    description: "Description one",
  },
  {
    icon: <span data-testid="icon-2">I2</span>,
    title: "Feature Two",
    description: "Description two",
  },
  {
    icon: <span data-testid="icon-3">I3</span>,
    title: "Feature Three",
    description: "Description three",
  },
];

describe("FeatureSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} />
      );
      expect(container.querySelector("[data-slot='feature-section']")).toBeInTheDocument();
    });

    it("renders all features", () => {
      render(<FeatureSection features={mockFeatures} />);
      expect(screen.getByText("Feature One")).toBeInTheDocument();
      expect(screen.getByText("Feature Two")).toBeInTheDocument();
      expect(screen.getByText("Feature Three")).toBeInTheDocument();
    });

    it("renders feature descriptions", () => {
      render(<FeatureSection features={mockFeatures} />);
      expect(screen.getByText("Description one")).toBeInTheDocument();
      expect(screen.getByText("Description two")).toBeInTheDocument();
    });

    it("renders feature icons", () => {
      render(<FeatureSection features={mockFeatures} />);
      expect(screen.getByTestId("icon-1")).toBeInTheDocument();
      expect(screen.getByTestId("icon-2")).toBeInTheDocument();
    });
  });

  describe("section header", () => {
    it("renders eyebrow when provided", () => {
      render(
        <FeatureSection features={mockFeatures} eyebrow="Features" />
      );
      expect(screen.getByText("Features")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <FeatureSection features={mockFeatures} title="Our Features" />
      );
      expect(screen.getByText("Our Features")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <FeatureSection
          features={mockFeatures}
          description="A great set of features"
        />
      );
      expect(screen.getByText("A great set of features")).toBeInTheDocument();
    });

    it("does not render header elements when not provided", () => {
      render(<FeatureSection features={mockFeatures} />);
      expect(screen.queryByText("Features")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} className="custom-class" />
      );
      expect(container.querySelector("[data-slot='feature-section']")).toHaveClass(
        "custom-class"
      );
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<FeatureSection ref={ref} features={mockFeatures} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <FeatureSection features={mockFeatures} data-testid="my-section" />
      );
      expect(screen.getByTestId("my-section")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} />
      );
      expect(container.querySelector("[data-slot='feature-section']")).toBeInTheDocument();
    });
  });

  describe("grid variant", () => {
    it("renders grid layout by default", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} />
      );
      // Should render FeatureCard components in a grid
      const featureCards = container.querySelectorAll("[data-slot='feature-card']");
      expect(featureCards.length).toBe(3);
    });

    it("renders grid with 2 columns", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} columns={2} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("renders grid with 3 columns", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} columns={3} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("renders grid with 4 columns", () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} columns={4} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("alternating variant", () => {
    const featuresWithImages = [
      {
        icon: <span>I1</span>,
        title: "First Feature",
        description: "First description",
        image: "https://example.com/img1.jpg",
        href: "/feature-1",
      },
      {
        icon: <span>I2</span>,
        title: "Second Feature",
        description: "Second description",
        image: "https://example.com/img2.jpg",
      },
    ];

    it("renders alternating layout", () => {
      const { container } = render(
        <FeatureSection features={featuresWithImages} variant="alternating" />
      );
      // Should NOT render FeatureCard components
      const featureCards = container.querySelectorAll("[data-slot='feature-card']");
      expect(featureCards.length).toBe(0);
    });

    it("renders images in alternating variant", () => {
      render(
        <FeatureSection features={featuresWithImages} variant="alternating" />
      );
      const images = screen.getAllByRole("img");
      expect(images.length).toBe(2);
      expect(images[0]).toHaveAttribute("src", "https://example.com/img1.jpg");
    });

    it("renders href links in alternating variant", () => {
      render(
        <FeatureSection features={featuresWithImages} variant="alternating" />
      );
      const link = screen.getByText("Learn more →");
      expect(link).toHaveAttribute("href", "/feature-1");
    });

    it("does not render link when href is not provided", () => {
      render(
        <FeatureSection
          features={[featuresWithImages[1]]}
          variant="alternating"
        />
      );
      expect(screen.queryByText("Learn more →")).not.toBeInTheDocument();
    });

    it("renders placeholder when no image is provided", () => {
      const noImageFeatures = [
        {
          icon: <span>I1</span>,
          title: "No Image Feature",
          description: "Description",
        },
      ];
      render(
        <FeatureSection features={noImageFeatures} variant="alternating" />
      );
      expect(screen.getByText("Feature image")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders with empty features array", () => {
      const { container } = render(<FeatureSection features={[]} />);
      expect(container.querySelector("[data-slot='feature-section']")).toBeInTheDocument();
    });

    it("renders with single feature", () => {
      render(<FeatureSection features={[mockFeatures[0]]} />);
      expect(screen.getByText("Feature One")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = render(
        <FeatureSection features={mockFeatures} title="Our Features" />
      );
      await expectNoA11yViolations(container);
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
  const defaultProps = {
    icon: <span data-testid="icon">★</span>,
    title: "Fast Builds",
    description: "Build your projects in seconds",
  };

  it("renders title", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText("Fast Builds")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText("Build your projects in seconds")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders as a div by default", () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as a link when href is provided", () => {
    render(<FeatureCard {...defaultProps} href="/features" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/features");
  });

  it("renders image in lg size variant", () => {
    render(<FeatureCard {...defaultProps} size="lg" image="/feature.png" />);
    const img = screen.getByAltText("Fast Builds");
    expect(img).toHaveAttribute("src", "/feature.png");
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders %s size without error",
    (size) => {
      render(<FeatureCard {...defaultProps} size={size} />);
      expect(screen.getByText("Fast Builds")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    const { container } = render(<FeatureCard {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("defaults icon alignment to left", () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).not.toHaveClass("mx-auto");
    expect(iconBox).not.toHaveClass("ml-auto");
  });

  it("centers icon when iconAlign is center", () => {
    const { container } = render(<FeatureCard {...defaultProps} iconAlign="center" />);
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).toHaveClass("mx-auto");
  });

  it("right-aligns icon when iconAlign is right", () => {
    const { container } = render(<FeatureCard {...defaultProps} iconAlign="right" />);
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).toHaveClass("ml-auto");
  });

  it("defaults text alignment to left", () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const contentDiv = container.querySelector("h3")?.parentElement;
    expect(contentDiv).not.toHaveClass("text-center");
    expect(contentDiv).not.toHaveClass("text-right");
  });

  it("centers text independently of icon", () => {
    const { container } = render(<FeatureCard {...defaultProps} textAlign="center" />);
    const contentDiv = container.querySelector("h3")?.parentElement;
    expect(contentDiv).toHaveClass("text-center");
    // icon should still be left-aligned
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).not.toHaveClass("mx-auto");
  });

  it("right-aligns text independently of icon", () => {
    const { container } = render(<FeatureCard {...defaultProps} textAlign="right" />);
    const contentDiv = container.querySelector("h3")?.parentElement;
    expect(contentDiv).toHaveClass("text-right");
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).not.toHaveClass("ml-auto");
  });

  it("allows different icon and text alignment", () => {
    const { container } = render(<FeatureCard {...defaultProps} iconAlign="center" textAlign="left" />);
    const iconBox = container.querySelector(".bg-white\\/5");
    expect(iconBox).toHaveClass("mx-auto");
    const contentDiv = container.querySelector("h3")?.parentElement;
    expect(contentDiv).not.toHaveClass("text-center");
  });
});

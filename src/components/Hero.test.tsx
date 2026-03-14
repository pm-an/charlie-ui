import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  const defaultProps = {
    title: "Build faster",
    description: "Ship products that matter",
  };

  it("renders as a section element", () => {
    const { container } = render(<Hero {...defaultProps} />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders title as h1", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1, name: "Build faster" })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("Ship products that matter")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<Hero {...defaultProps} eyebrow="New release" />);
    expect(screen.getByText("New release")).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(<Hero {...defaultProps} actions={<button>Get Started</button>} />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Hero {...defaultProps}>
        <div data-testid="hero-child">Custom content</div>
      </Hero>
    );
    expect(screen.getByTestId("hero-child")).toBeInTheDocument();
  });

  it("renders gradient background when gradient=true", () => {
    const { container } = render(<Hero {...defaultProps} gradient />);
    expect(container.querySelector(".bg-aurora")).toBeInTheDocument();
  });

  it("does not render gradient by default", () => {
    const { container } = render(<Hero {...defaultProps} />);
    expect(container.querySelector(".bg-aurora")).not.toBeInTheDocument();
  });

  it.each(["centered", "split"] as const)(
    "renders %s variant",
    (variant) => {
      render(<Hero {...defaultProps} variant={variant} />);
      expect(screen.getByText("Build faster")).toBeInTheDocument();
    }
  );

  it("split variant uses grid layout", () => {
    const { container } = render(
      <Hero {...defaultProps} variant="split">
        <div>Right side</div>
      </Hero>
    );
    const gridDiv = container.querySelector(".grid");
    expect(gridDiv).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Hero {...defaultProps} className="custom" />);
    expect(container.querySelector("section")).toHaveClass("custom");
  });
});

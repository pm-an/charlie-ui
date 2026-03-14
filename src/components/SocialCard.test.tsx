import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SocialCard } from "./SocialCard";
import { expectNoA11yViolations } from "../test/a11y";

describe("SocialCard", () => {
  const defaultProps = {
    icon: <span data-testid="icon">X</span>,
    title: "Twitter",
    description: "Follow us on Twitter",
    color: "blue" as const,
  };

  it("renders title", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByText("Follow us on Twitter")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<SocialCard {...defaultProps} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders as div by default", () => {
    const { container } = render(<SocialCard {...defaultProps} />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as link when href is provided", () => {
    render(<SocialCard {...defaultProps} href="https://twitter.com" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://twitter.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["red", "blue", "purple", "orange"] as const)(
    "renders %s color variant",
    (color) => {
      render(<SocialCard {...defaultProps} color={color} />);
      expect(screen.getByText("Twitter")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    const { container } = render(<SocialCard {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<SocialCard {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});

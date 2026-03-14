import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BlogCard } from "./BlogCard";
import { expectNoA11yViolations } from "../test/a11y";

describe("BlogCard", () => {
  const defaultProps = {
    title: "Getting Started with React",
    excerpt: "Learn the basics of React in this guide.",
    date: "March 10, 2026",
  };

  it("renders title", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Getting Started with React")).toBeInTheDocument();
  });

  it("renders excerpt", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Learn the basics of React in this guide.")).toBeInTheDocument();
  });

  it("renders date", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("March 10, 2026")).toBeInTheDocument();
  });

  it("renders as div by default (no href)", () => {
    const { container } = render(<BlogCard {...defaultProps} />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as a link when href is provided", () => {
    render(<BlogCard {...defaultProps} href="/blog/react" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/react");
  });

  it("renders tag when provided", () => {
    render(<BlogCard {...defaultProps} tag="Tutorial" />);
    expect(screen.getByText("Tutorial")).toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(<BlogCard {...defaultProps} image="/blog.jpg" />);
    const img = screen.getByAltText("Getting Started with React");
    expect(img).toHaveAttribute("src", "/blog.jpg");
  });

  it("merges custom className", () => {
    const { container } = render(<BlogCard {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<BlogCard {...defaultProps} tag="Tutorial" />);
    await expectNoA11yViolations(container);
  });
});

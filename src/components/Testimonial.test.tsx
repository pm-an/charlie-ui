import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Testimonial } from "./Testimonial";

describe("Testimonial", () => {
  const defaultProps = {
    quote: "Great product!",
    author: "Jane Doe",
    role: "CEO",
  };

  it("renders the quote", () => {
    render(<Testimonial {...defaultProps} />);
    expect(screen.getByText("Great product!")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<Testimonial {...defaultProps} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders the role", () => {
    render(<Testimonial {...defaultProps} />);
    expect(screen.getByText("CEO")).toBeInTheDocument();
  });

  it("renders company alongside role", () => {
    render(<Testimonial {...defaultProps} company="Acme Inc" />);
    expect(screen.getByText(/Acme Inc/)).toBeInTheDocument();
  });

  it("renders avatar image when src provided", () => {
    render(<Testimonial {...defaultProps} avatar="/avatar.jpg" />);
    const img = screen.getByAltText("Jane Doe");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/avatar.jpg");
  });

  it("does not render img when no avatar", () => {
    render(<Testimonial {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders blockquote element", () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("renders decorative quote mark", () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    const decorative = container.querySelector('[aria-hidden="true"]');
    expect(decorative).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Testimonial {...defaultProps} className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});

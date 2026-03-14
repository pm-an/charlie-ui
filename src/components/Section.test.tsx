import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
  it("renders as a section element", () => {
    const { container } = render(<Section>Content</Section>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders title as h2", () => {
    render(<Section title="Features" />);
    expect(screen.getByRole("heading", { level: 2, name: "Features" })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Section title="T" description="Section description" />);
    expect(screen.getByText("Section description")).toBeInTheDocument();
  });

  it("renders eyebrow", () => {
    render(<Section eyebrow="Why us" title="T" />);
    expect(screen.getByText("Why us")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Section>
        <div data-testid="child">Child content</div>
      </Section>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("does not render header when no title/eyebrow/description", () => {
    render(<Section>Content only</Section>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders %s size variant",
    (size) => {
      const { container } = render(<Section size={size}>Content</Section>);
      expect(container.querySelector("section")).toBeInTheDocument();
    }
  );

  it("centers text by default", () => {
    render(<Section title="Centered" />);
    const heading = screen.getByText("Centered");
    expect(heading.closest("div")).toHaveClass("text-center");
  });

  it("aligns left when specified", () => {
    render(<Section title="Left" align="left" />);
    const heading = screen.getByText("Left");
    expect(heading.closest("div")).not.toHaveClass("text-center");
  });

  it("merges custom className", () => {
    const { container } = render(<Section className="custom">C</Section>);
    expect(container.querySelector("section")).toHaveClass("custom");
  });
});

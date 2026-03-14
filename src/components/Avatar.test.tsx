import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "./Avatar";
import { expectNoA11yViolations } from "../test/a11y";

describe("Avatar", () => {
  it("renders image when src is provided", () => {
    render(<Avatar src="/photo.jpg" alt="John" />);
    const img = screen.getByRole("img", { name: "John" });
    expect(img).toBeInTheDocument();
  });

  it("renders fallback letter when no src", () => {
    render(<Avatar alt="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("uses custom fallback text", () => {
    render(<Avatar alt="Alice" fallback="AL" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("renders status dot when status is provided", () => {
    const { container } = render(<Avatar alt="Bob" status="online" />);
    // The status dot is the second span child
    const spans = container.querySelectorAll("span > span");
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });

  it("does not render status dot when no status", () => {
    const { container } = render(<Avatar alt="Bob" />);
    // Only the fallback text span, no status dot
    const rootSpans = container.firstElementChild?.children;
    expect(rootSpans?.length).toBe(1);
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders %s size without error",
    (size) => {
      const { container } = render(<Avatar alt="Test" size={size} />);
      expect(container.firstChild).toBeInTheDocument();
    }
  );

  it.each(["online", "offline", "busy"] as const)(
    "renders %s status without error",
    (status) => {
      const { container } = render(<Avatar alt="Test" status={status} />);
      expect(container.firstChild).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    const { container } = render(<Avatar alt="Test" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("includes status in accessible label", () => {
    render(<Avatar alt="Jane Doe" status="online" />);
    expect(screen.getByRole("img", { name: "Jane Doe, online" })).toBeInTheDocument();
  });

  it("has aria-label without status", () => {
    render(<Avatar alt="Jane Doe" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
  });

  it("marks status dot as aria-hidden", () => {
    const { container } = render(<Avatar alt="Bob" status="online" />);
    const rootSpans = container.firstElementChild?.querySelectorAll("[aria-hidden='true']");
    expect(rootSpans?.length).toBeGreaterThanOrEqual(1);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<Avatar alt="Jane Doe" status="online" />);
    await expectNoA11yViolations(container);
  });
});

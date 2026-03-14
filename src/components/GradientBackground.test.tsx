import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GradientBackground } from "./GradientBackground";

describe("GradientBackground", () => {
  it("renders a div element", () => {
    const { container } = render(<GradientBackground />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("has pointer-events-none class", () => {
    const { container } = render(<GradientBackground />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });

  it("has absolute positioning", () => {
    const { container } = render(<GradientBackground />);
    expect(container.firstChild).toHaveClass("absolute");
  });

  it.each(["aurora", "nebula", "warm"] as const)(
    "renders %s variant with background style",
    (variant) => {
      const { container } = render(<GradientBackground variant={variant} />);
      const el = container.firstChild as HTMLElement;
      expect(el.style.background).toBeTruthy();
    }
  );

  it("custom variant does not set default background", () => {
    const { container } = render(<GradientBackground variant="custom" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe("");
  });

  it("custom variant uses provided style", () => {
    const { container } = render(
      <GradientBackground variant="custom" style={{ background: "red" }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe("red");
  });

  it("merges custom className", () => {
    const { container } = render(<GradientBackground className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});

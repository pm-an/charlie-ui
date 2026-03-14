import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./Skeleton";
import { expectNoA11yViolations } from "../test/a11y";

describe("Skeleton", () => {
  it("renders a div element", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies shimmer animation classes", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("overflow-hidden", "relative");
  });

  it.each(["text", "circle", "rect"] as const)(
    "renders %s variant without error",
    (variant) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect(container.firstChild).toBeInTheDocument();
    }
  );

  it("applies custom width as style", () => {
    const { container } = render(<Skeleton width={200} />);
    expect(container.firstChild).toHaveStyle({ width: "200px" });
  });

  it("applies custom height as style", () => {
    const { container } = render(<Skeleton height="3rem" />);
    expect(container.firstChild).toHaveStyle({ height: "3rem" });
  });

  it("applies both width and height", () => {
    const { container } = render(<Skeleton width={100} height={50} />);
    expect(container.firstChild).toHaveStyle({ width: "100px", height: "50px" });
  });

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("merges custom style with width/height", () => {
    const { container } = render(<Skeleton width={100} style={{ opacity: 0.5 }} />);
    expect(container.firstChild).toHaveStyle({ width: "100px", opacity: "0.5" });
  });

  it("has role status and default loading label", () => {
    render(<Skeleton />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts custom loadingLabel", () => {
    render(<Skeleton loadingLabel="Loading content" />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-label", "Loading content");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<Skeleton />);
    await expectNoA11yViolations(container);
  });
});

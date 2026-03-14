import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>Tag</Badge>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it.each(["default", "red", "blue", "green", "yellow", "pro"] as const)(
    "renders %s variant without error",
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  );

  it.each(["sm", "md"] as const)(
    "renders %s size without error",
    (size) => {
      render(<Badge size={size}>Size</Badge>);
      expect(screen.getByText("Size")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    render(<Badge className="extra">C</Badge>);
    expect(screen.getByText("C")).toHaveClass("extra");
  });

  it("passes through HTML attributes", () => {
    render(<Badge data-testid="badge-test">Test</Badge>);
    expect(screen.getByTestId("badge-test")).toBeInTheDocument();
  });
});

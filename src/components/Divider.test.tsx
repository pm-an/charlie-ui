import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders as a separator", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders label text when provided", () => {
    render(<Divider label="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders without label as a simple div", () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveAttribute("role", "separator");
  });

  it.each(["solid", "dotted"] as const)(
    "renders %s variant without error",
    (variant) => {
      render(<Divider variant={variant} />);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    render(<Divider className="custom-divider" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-divider");
  });
});

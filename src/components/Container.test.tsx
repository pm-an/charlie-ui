import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children", () => {
    render(<Container>Content here</Container>);
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("renders as a div", () => {
    const { container } = render(<Container>C</Container>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it.each(["sm", "md", "lg", "xl"] as const)(
    "applies %s size max-width class",
    (size) => {
      const { container } = render(<Container size={size}>C</Container>);
      expect(container.firstChild).toBeInTheDocument();
    }
  );

  it("merges custom className", () => {
    const { container } = render(<Container className="custom">C</Container>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("passes through HTML attributes", () => {
    render(<Container data-testid="container-test">C</Container>);
    expect(screen.getByTestId("container-test")).toBeInTheDocument();
  });
});

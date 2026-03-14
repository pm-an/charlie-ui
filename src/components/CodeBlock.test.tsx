import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders code from children", () => {
    render(<CodeBlock>{'const x = 1;'}</CodeBlock>);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("renders code from code prop", () => {
    render(<CodeBlock code="const y = 2;" />);
    expect(screen.getByText("const y = 2;")).toBeInTheDocument();
  });

  it("displays language label", () => {
    render(<CodeBlock language="typescript">code</CodeBlock>);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("shows copy button by default", () => {
    render(<CodeBlock>code</CodeBlock>);
    expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
  });

  it("hides copy button when showCopy is false", () => {
    render(<CodeBlock showCopy={false}>code</CodeBlock>);
    expect(screen.queryByLabelText("Copy code")).not.toBeInTheDocument();
  });

  it("renders inside a pre > code structure", () => {
    const { container } = render(<CodeBlock>test</CodeBlock>);
    const pre = container.querySelector("pre");
    const code = container.querySelector("code");
    expect(pre).toBeInTheDocument();
    expect(code).toBeInTheDocument();
    expect(pre).toContainElement(code);
  });

  it("merges custom className on pre element", () => {
    const { container } = render(<CodeBlock className="my-code">code</CodeBlock>);
    expect(container.querySelector("pre")).toHaveClass("my-code");
  });
});

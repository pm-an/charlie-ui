import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollArea } from "../ScrollArea";

describe("ScrollArea", () => {
  it("renders children", () => {
    render(<ScrollArea>Scroll content</ScrollArea>);
    expect(screen.getByText("Scroll content")).toBeInTheDocument();
  });

  it("applies vertical overflow classes by default", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    expect(container.firstChild).toHaveClass("overflow-y-auto");
    expect(container.firstChild).toHaveClass("overflow-x-hidden");
  });

  it("applies horizontal overflow classes", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveClass("overflow-x-auto");
    expect(container.firstChild).toHaveClass("overflow-y-hidden");
  });

  it("applies both overflow classes", () => {
    const { container } = render(
      <ScrollArea orientation="both">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveClass("overflow-auto");
  });

  it("applies thin scrollbar classes by default", () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar]:w-1.5"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb]:bg-white/10"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb]:rounded-full"
    );
  });

  it("applies default scrollbar classes", () => {
    const { container } = render(
      <ScrollArea scrollbarSize="default">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar]:w-2.5"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-track]:bg-white/5"
    );
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar-thumb]:bg-white/15"
    );
  });

  it("hides scrollbar when hideScrollbar is true", () => {
    const { container } = render(
      <ScrollArea hideScrollbar>Content</ScrollArea>
    );
    expect(container.firstChild).toHaveClass("scrollbar-none");
    expect(container.firstChild).toHaveClass(
      "[&::-webkit-scrollbar]:hidden"
    );
    // Should not have visible scrollbar classes
    expect(container.firstChild).not.toHaveClass(
      "[&::-webkit-scrollbar]:w-1.5"
    );
  });

  it("applies maxHeight as number (px)", () => {
    const { container } = render(
      <ScrollArea maxHeight={300}>Content</ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "300px" });
  });

  it("applies maxHeight as string", () => {
    const { container } = render(
      <ScrollArea maxHeight="50vh">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "50vh" });
  });

  it("applies maxWidth as number (px)", () => {
    const { container } = render(
      <ScrollArea maxWidth={400}>Content</ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: "400px" });
  });

  it("applies maxWidth as string", () => {
    const { container } = render(
      <ScrollArea maxWidth="80%">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: "80%" });
  });

  it("merges className", () => {
    const { container } = render(
      <ScrollArea className="custom-class">Content</ScrollArea>
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<ScrollArea ref={ref}>Content</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes HTML attributes", () => {
    render(
      <ScrollArea data-testid="scroll" aria-label="Scrollable area">
        Content
      </ScrollArea>
    );
    expect(screen.getByTestId("scroll")).toBeInTheDocument();
    expect(screen.getByLabelText("Scrollable area")).toBeInTheDocument();
  });

  it("merges custom style with maxHeight/maxWidth", () => {
    const { container } = render(
      <ScrollArea maxHeight={200} style={{ padding: "8px" }}>
        Content
      </ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({
      maxHeight: "200px",
      padding: "8px",
    });
  });
});

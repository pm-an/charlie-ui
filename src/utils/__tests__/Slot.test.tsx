import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { Slot } from "../Slot";

describe("Slot", () => {
  it("renders the child element", () => {
    render(
      <Slot>
        <button>Click me</button>
      </Slot>
    );
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("merges className from slot and child", () => {
    const { container } = render(
      <Slot className="slot-class">
        <div className="child-class">Content</div>
      </Slot>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("slot-class");
    expect(el.className).toContain("child-class");
  });

  it("merges style objects (child style takes precedence)", () => {
    const { container } = render(
      <Slot style={{ color: "red", fontSize: "14px" }}>
        <div style={{ color: "blue", padding: "8px" }}>Styled</div>
      </Slot>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.color).toBe("blue"); // child wins
    expect(el.style.fontSize).toBe("14px"); // from slot
    expect(el.style.padding).toBe("8px"); // from child
  });

  it("composes event handlers (slot first, then child)", () => {
    const order: string[] = [];
    render(
      <Slot onClick={() => order.push("slot")}>
        <button onClick={() => order.push("child")}>Click</button>
      </Slot>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(order).toEqual(["slot", "child"]);
  });

  it("forwards data-* attributes from slot to child", () => {
    const { container } = render(
      <Slot data-slot="button" data-state="active">
        <button>Test</button>
      </Slot>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-slot", "button");
    expect(el).toHaveAttribute("data-state", "active");
  });

  it("forwards aria-* attributes from slot to child", () => {
    const { container } = render(
      <Slot aria-label="Test label" aria-disabled="true">
        <div>Content</div>
      </Slot>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-label", "Test label");
    expect(el).toHaveAttribute("aria-disabled", "true");
  });

  it("composes refs from slot and child", () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLButtonElement>();

    render(
      <Slot ref={slotRef}>
        <button ref={childRef}>Ref test</button>
      </Slot>
    );

    expect(slotRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(childRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(slotRef.current).toBe(childRef.current);
  });

  it("returns null for non-element children", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <Slot>{"just a string"}</Slot>
    );
    expect(container.innerHTML).toBe("");
    consoleSpy.mockRestore();
  });

  it("child props take precedence over slot props for non-event attributes", () => {
    const { container } = render(
      <Slot id="slot-id" title="slot-title">
        <div id="child-id">Content</div>
      </Slot>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.id).toBe("child-id"); // child wins
    expect(el.title).toBe("slot-title"); // slot fills in
  });
});

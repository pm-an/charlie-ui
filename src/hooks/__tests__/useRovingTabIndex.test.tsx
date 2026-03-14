import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { useRef, type KeyboardEvent } from "react";
import { useRovingTabIndex } from "../useRovingTabIndex";

function TabGroup() {
  const ref = useRef<HTMLDivElement>(null);
  const { onKeyDown } = useRovingTabIndex(ref, {
    direction: "horizontal",
    itemSelector: '[role="tab"]',
  });

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown as unknown as (e: KeyboardEvent<HTMLDivElement>) => void}
    >
      <button role="tab" tabIndex={0}>Tab 1</button>
      <button role="tab" tabIndex={-1}>Tab 2</button>
      <button role="tab" tabIndex={-1}>Tab 3</button>
    </div>
  );
}

describe("useRovingTabIndex", () => {
  it("moves focus with ArrowRight", async () => {
    const user = userEvent.setup();
    render(<TabGroup />);

    screen.getByText("Tab 1").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Tab 2")).toHaveFocus();
  });

  it("moves focus with ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<TabGroup />);

    screen.getByText("Tab 2").focus();
    // Set tabindex to 0 for Tab 2 so it's the active one
    screen.getByText("Tab 2").setAttribute("tabindex", "0");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Tab 1")).toHaveFocus();
  });

  it("wraps around on ArrowRight at the end", async () => {
    const user = userEvent.setup();
    render(<TabGroup />);

    screen.getByText("Tab 3").focus();
    screen.getByText("Tab 3").setAttribute("tabindex", "0");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Tab 1")).toHaveFocus();
  });

  it("navigates to first with Home", async () => {
    const user = userEvent.setup();
    render(<TabGroup />);

    screen.getByText("Tab 3").focus();
    screen.getByText("Tab 3").setAttribute("tabindex", "0");
    await user.keyboard("{Home}");
    expect(screen.getByText("Tab 1")).toHaveFocus();
  });

  it("navigates to last with End", async () => {
    const user = userEvent.setup();
    render(<TabGroup />);

    screen.getByText("Tab 1").focus();
    await user.keyboard("{End}");
    expect(screen.getByText("Tab 3")).toHaveFocus();
  });
});

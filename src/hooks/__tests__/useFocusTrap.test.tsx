import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { useRef } from "react";
import { useFocusTrap } from "../useFocusTrap";

function TrapContainer({ active = true, autoFocus = true }: { active?: boolean; autoFocus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active, autoFocus);
  return (
    <div ref={ref} tabIndex={-1} data-testid="container">
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("auto-focuses the first focusable element", async () => {
    render(<TrapContainer />);
    // Wait for rAF
    await new Promise((r) => requestAnimationFrame(r));
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps focus from last to first on Tab", async () => {
    const user = userEvent.setup();
    render(<TrapContainer />);
    await new Promise((r) => requestAnimationFrame(r));

    screen.getByText("Third").focus();
    await user.tab();
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps focus from first to last on Shift+Tab", async () => {
    const user = userEvent.setup();
    render(<TrapContainer />);
    await new Promise((r) => requestAnimationFrame(r));

    screen.getByText("First").focus();
    await user.tab({ shift: true });
    expect(screen.getByText("Third")).toHaveFocus();
  });

  it("does nothing when inactive", async () => {
    render(<TrapContainer active={false} />);
    await new Promise((r) => requestAnimationFrame(r));
    // First should NOT be auto-focused
    expect(screen.getByText("First")).not.toHaveFocus();
  });

  it("skips auto-focus when autoFocus is false", async () => {
    render(<TrapContainer autoFocus={false} />);
    await new Promise((r) => requestAnimationFrame(r));
    expect(screen.getByText("First")).not.toHaveFocus();
  });
});

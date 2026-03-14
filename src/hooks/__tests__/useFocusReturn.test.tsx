import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { useState } from "react";
import { useFocusReturn } from "../useFocusReturn";

function TestComponent() {
  const [open, setOpen] = useState(false);
  useFocusReturn(open);

  return (
    <div>
      <button onClick={() => setOpen(true)} data-testid="trigger">
        Open
      </button>
      {open && (
        <div>
          <button onClick={() => setOpen(false)} data-testid="close">
            Close
          </button>
        </div>
      )}
    </div>
  );
}

describe("useFocusReturn", () => {
  it("restores focus to the previously focused element on close", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    const trigger = screen.getByTestId("trigger");
    trigger.focus();
    expect(trigger).toHaveFocus();

    // Open
    await user.click(trigger);
    const closeBtn = screen.getByTestId("close");
    closeBtn.focus();

    // Close
    await user.click(closeBtn);

    // Wait for rAF
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(trigger).toHaveFocus();
  });
});

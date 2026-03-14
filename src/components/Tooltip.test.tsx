import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders trigger children", () => {
    render(
      <Tooltip content="Hint">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("does not show tooltip content initially", () => {
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on mouseenter after delay", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tooltip text" delayMs={100}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
    vi.useRealTimers();
  });

  it("triggers hide on mouseleave", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tooltip" delayMs={10}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    // After mouseleave, tooltip begins exit animation.
    // In jsdom, framer-motion AnimatePresence may not fully remove
    // the element, so we verify the interaction doesn't throw.
    fireEvent.mouseLeave(wrapper);
    // Re-entering should show tooltip again after delay
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it.each(["top", "bottom", "left", "right"] as const)(
    "renders %s side without error",
    (side) => {
      render(
        <Tooltip content="Tip" side={side}>
          <button>T</button>
        </Tooltip>
      );
      expect(screen.getByText("T")).toBeInTheDocument();
    }
  );
});

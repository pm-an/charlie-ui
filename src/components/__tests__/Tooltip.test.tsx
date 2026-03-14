import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tooltip } from "../Tooltip";
import { expectNoA11yViolations } from "../../test/a11y";

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

  it("shows tooltip on focus (keyboard trigger)", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Keyboard hint" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.focus(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Keyboard hint");
    vi.useRealTimers();
  });

  it("hides tooltip on blur", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Blur test" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.focus(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.blur(wrapper);
    // After blur, state is closed (AnimatePresence exit might keep element in jsdom)
    expect(wrapper).toHaveAttribute("data-state", "closed");
    vi.useRealTimers();
  });

  it("sets aria-describedby linking trigger to tooltip content", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Description text" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;

    // Before showing, aria-describedby should not be set
    expect(wrapper).not.toHaveAttribute("aria-describedby");

    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // After showing, aria-describedby should link to tooltip
    const describedBy = wrapper.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const tooltipEl = document.getElementById(describedBy!);
    expect(tooltipEl).toHaveTextContent("Description text");
    expect(tooltipEl).toHaveAttribute("role", "tooltip");
    vi.useRealTimers();
  });

  it("dismisses on Escape key (WCAG 1.4.13)", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Escape test" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });

    expect(wrapper).toHaveAttribute("data-state", "closed");
    vi.useRealTimers();
  });

  it("tooltip is hoverable (no pointer-events-none)", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hoverable tooltip" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).not.toContain("pointer-events-none");
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

  it("passes axe accessibility checks when visible", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <Tooltip content="Accessible tooltip" delayMs={0}>
        <button>Trigger</button>
      </Tooltip>
    );
    const wrapper = screen.getByText("Trigger").closest("span")!;
    fireEvent.mouseEnter(wrapper);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    vi.useRealTimers();
    await expectNoA11yViolations(container);
  });
});

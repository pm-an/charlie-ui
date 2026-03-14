import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders title", () => {
    render(<Toast title="Success!" />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Toast title="T" description="Operation completed" />);
    expect(screen.getByText("Operation completed")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<Toast title="T" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<Toast title="Hidden" open={false} />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    render(<Toast title="T" onClose={() => {}} />);
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(<Toast title="T" />);
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast title="T" onClose={onClose} />);
    await user.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("auto-closes after duration", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast title="T" onClose={onClose} duration={3000} />);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("does not auto-close when duration is 0", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast title="T" onClose={onClose} duration={0} />);
    vi.advanceTimersByTime(10000);
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("renders action content", () => {
    render(<Toast title="T" action={<button>Undo</button>} />);
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it.each(["default", "success", "error", "warning"] as const)(
    "renders %s variant",
    (variant) => {
      render(<Toast title="Test" variant={variant} />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    }
  );

  it("defaults to bottom-right position", () => {
    render(<Toast title="T" />);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("fixed");
    expect(el).toHaveAttribute("data-position", "bottom-right");
    expect(el).toHaveClass("bottom-4", "right-4");
  });

  it.each([
    ["top-left", "top-4", "left-4"],
    ["top-center", "top-4", "left-1/2"],
    ["top-right", "top-4", "right-4"],
    ["middle-left", "top-1/2", "left-4"],
    ["middle-right", "top-1/2", "right-4"],
    ["bottom-left", "bottom-4", "left-4"],
    ["bottom-center", "bottom-4", "left-1/2"],
    ["bottom-right", "bottom-4", "right-4"],
  ] as const)("renders at %s position", (position, verticalClass, horizontalClass) => {
    render(<Toast title="T" position={position} />);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("fixed", verticalClass, horizontalClass);
    expect(el).toHaveAttribute("data-position", position);
  });
});

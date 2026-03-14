import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Toaster } from "../Toaster";
import { toast } from "../toast-store";
import { expectNoA11yViolations } from "../../test/a11y";

describe("toast-store", () => {
  beforeEach(() => {
    act(() => {
      toast.dismissAll();
    });
  });

  it("toast() creates a default toast", () => {
    render(<Toaster />);
    act(() => {
      toast("Hello world");
    });
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("toast.success() creates a success toast", () => {
    render(<Toaster />);
    act(() => {
      toast.success("Saved!");
    });
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });

  it("toast.error() creates an error toast", () => {
    render(<Toaster />);
    act(() => {
      toast.error("Failed");
    });
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("toast.warning() creates a warning toast", () => {
    render(<Toaster />);
    act(() => {
      toast.warning("Watch out");
    });
    expect(screen.getByText("Watch out")).toBeInTheDocument();
  });

  it("toast with description renders description", () => {
    render(<Toaster />);
    act(() => {
      toast.success("Done", { description: "All checks passed" });
    });
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("All checks passed")).toBeInTheDocument();
  });

  it("toast.dismiss() removes a specific toast", () => {
    render(<Toaster />);
    let id: string;
    act(() => {
      id = toast("To dismiss");
    });
    expect(screen.getByText("To dismiss")).toBeInTheDocument();

    act(() => {
      toast.dismiss(id!);
    });
    expect(screen.queryByText("To dismiss")).not.toBeInTheDocument();
  });

  it("toast.dismissAll() removes all toasts", () => {
    render(<Toaster />);
    act(() => {
      toast("First");
      toast("Second");
      toast("Third");
    });
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();

    act(() => {
      toast.dismissAll();
    });
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.queryByText("Second")).not.toBeInTheDocument();
    expect(screen.queryByText("Third")).not.toBeInTheDocument();
  });

  it("returns a unique id from toast()", () => {
    const id1 = toast("A");
    const id2 = toast("B");
    expect(id1).not.toBe(id2);
    act(() => {
      toast.dismissAll();
    });
  });

  it("enforces minimum 5s duration (clamps short durations)", () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast("Short", { duration: 2000 });
    });
    expect(screen.getByText("Short")).toBeInTheDocument();

    // After 2s it should still be visible (clamped to 5s)
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.getByText("Short")).toBeInTheDocument();

    // After 5s total it should be dismissed
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Short")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("allows duration=0 (no auto-dismiss)", () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast("Persistent", { duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText("Persistent")).toBeInTheDocument();
    vi.useRealTimers();
    act(() => {
      toast.dismissAll();
    });
  });
});

describe("Toaster", () => {
  beforeEach(() => {
    act(() => {
      toast.dismissAll();
    });
  });

  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector("[data-slot='toaster']")).toBeInTheDocument();
  });

  it("respects max prop", () => {
    render(<Toaster max={2} />);
    act(() => {
      toast("One");
      toast("Two");
      toast("Three");
    });
    // Only last 2 should be visible
    expect(screen.queryByText("One")).not.toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("auto-dismisses after duration", () => {
    vi.useFakeTimers();
    render(<Toaster duration={5000} />);
    act(() => {
      toast("Ephemeral");
    });
    expect(screen.getByText("Ephemeral")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5100);
    });
    expect(screen.queryByText("Ephemeral")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has proper aria-live region", () => {
    const { container } = render(<Toaster />);
    const region = container.querySelector("[aria-live='polite']");
    expect(region).toBeInTheDocument();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast("Accessible toast");
    });
    await expectNoA11yViolations(container);
  });
});

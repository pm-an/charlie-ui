import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CopyButton } from "../CopyButton";

describe("CopyButton", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders with default label", () => {
      render(<CopyButton value="test" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Copy")).toBeInTheDocument();
    });

    it("renders custom label", () => {
      render(<CopyButton value="test" label="Copy code" />);
      expect(screen.getByText("Copy code")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<CopyButton value="test" className="my-custom" />);
      expect(screen.getByRole("button")).toHaveClass("my-custom");
    });

    it("has button type", () => {
      render(<CopyButton value="test" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("spreads additional HTML attributes", () => {
      render(<CopyButton value="test" data-testid="copy-btn" />);
      expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
    });
  });

  describe("copy functionality", () => {
    it("copies value to clipboard on click", async () => {
      render(<CopyButton value="hello world" />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      expect(writeTextMock).toHaveBeenCalledWith("hello world");
    });

    it("shows copied state after click", async () => {
      render(<CopyButton value="test" />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      await waitFor(() => {
        expect(screen.getByText("Copied!")).toBeInTheDocument();
      });
    });

    it("shows custom copiedLabel when copied", async () => {
      render(<CopyButton value="test" copiedLabel="Done!" />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      await waitFor(() => {
        expect(screen.getByText("Done!")).toBeInTheDocument();
      });
    });

    it("resets to default state after timeout", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      render(<CopyButton value="test" timeout={1000} />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      await waitFor(() => {
        expect(screen.getByText("Copied!")).toBeInTheDocument();
      });
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      await waitFor(() => {
        expect(screen.getByText("Copy")).toBeInTheDocument();
      });
    });

    it("calls onCopy callback after copying", async () => {
      const onCopy = vi.fn();
      render(<CopyButton value="test" onCopy={onCopy} />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      expect(onCopy).toHaveBeenCalledTimes(1);
    });
  });

  describe("icon-only mode", () => {
    it("renders without text label when iconOnly is true", () => {
      render(<CopyButton value="test" iconOnly />);
      expect(screen.queryByText("Copy")).not.toBeInTheDocument();
    });

    it("has aria-label when iconOnly", () => {
      render(<CopyButton value="test" iconOnly />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy");
    });

    it("updates aria-label to copiedLabel when copied", async () => {
      render(<CopyButton value="test" iconOnly />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button"));
      });
      await waitFor(() => {
        expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copied!");
      });
    });
  });

  describe("disabled state", () => {
    it("disables the button", () => {
      render(<CopyButton value="test" disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not copy when disabled", async () => {
      render(<CopyButton value="test" disabled />);
      fireEvent.click(screen.getByRole("button"));
      expect(writeTextMock).not.toHaveBeenCalled();
    });
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<CopyButton value="test" variant="default" />);
      expect(screen.getByRole("button")).toHaveClass("bg-bg-subtle");
    });

    it("renders ghost variant", () => {
      render(<CopyButton value="test" variant="ghost" />);
      expect(screen.getByRole("button")).toHaveClass("bg-transparent");
    });

    it("renders outline variant", () => {
      render(<CopyButton value="test" variant="outline" />);
      expect(screen.getByRole("button")).toHaveClass("border");
    });

    it("renders each variant without errors", () => {
      const variants = ["default", "ghost", "outline"] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<CopyButton value="test" variant={variant} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("sizes", () => {
    it("renders sm size", () => {
      render(<CopyButton value="test" size="sm" />);
      expect(screen.getByRole("button")).toHaveClass("h-7");
    });

    it("renders md size", () => {
      render(<CopyButton value="test" size="md" />);
      expect(screen.getByRole("button")).toHaveClass("h-8");
    });

    it("renders lg size", () => {
      render(<CopyButton value="test" size="lg" />);
      expect(screen.getByRole("button")).toHaveClass("h-9");
    });

    it("renders each size without errors", () => {
      const sizes = ["sm", "md", "lg"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<CopyButton value="test" size={size} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });
  });
});

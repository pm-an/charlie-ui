import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SpinnerOverlay } from "../SpinnerOverlay";

describe("SpinnerOverlay", () => {
  it("renders children when not spinning", () => {
    render(
      <SpinnerOverlay spinning={false}>
        <p>Content here</p>
      </SpinnerOverlay>
    );
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("shows overlay when spinning", () => {
    render(
      <SpinnerOverlay spinning>
        <p>Content here</p>
      </SpinnerOverlay>
    );
    expect(screen.getByTestId("spinner-overlay")).toBeInTheDocument();
  });

  it("hides overlay when spinning is false", () => {
    render(
      <SpinnerOverlay spinning={false}>
        <p>Content here</p>
      </SpinnerOverlay>
    );
    expect(screen.queryByTestId("spinner-overlay")).not.toBeInTheDocument();
  });

  it("shows description text", () => {
    render(
      <SpinnerOverlay spinning description="Loading your data...">
        <p>Content</p>
      </SpinnerOverlay>
    );
    expect(screen.getByText("Loading your data...")).toBeInTheDocument();
  });

  it("renders fixed overlay in fullscreen mode", () => {
    render(
      <SpinnerOverlay fullscreen spinning>
        <p>Content</p>
      </SpinnerOverlay>
    );
    const overlay = screen.getByTestId("spinner-overlay");
    expect(overlay).toHaveClass("fixed");
    expect(overlay).toHaveClass("inset-0");
    expect(overlay).toHaveClass("z-50");
  });

  describe("delay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("does not show overlay immediately when delay is set", () => {
      render(
        <SpinnerOverlay spinning delay={500}>
          <p>Content</p>
        </SpinnerOverlay>
      );
      expect(screen.queryByTestId("spinner-overlay")).not.toBeInTheDocument();
    });

    it("shows overlay after the delay timeout", () => {
      render(
        <SpinnerOverlay spinning delay={500}>
          <p>Content</p>
        </SpinnerOverlay>
      );
      expect(screen.queryByTestId("spinner-overlay")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByTestId("spinner-overlay")).toBeInTheDocument();
    });
  });

  it("has aria-busy on overlay", () => {
    render(
      <SpinnerOverlay spinning>
        <p>Content</p>
      </SpinnerOverlay>
    );
    const overlay = screen.getByTestId("spinner-overlay");
    expect(overlay).toHaveAttribute("aria-busy", "true");
  });

  it("renders custom indicator instead of spinner", () => {
    render(
      <SpinnerOverlay
        spinning
        indicator={<div data-testid="custom-indicator">Custom</div>}
      >
        <p>Content</p>
      </SpinnerOverlay>
    );
    expect(screen.getByTestId("custom-indicator")).toBeInTheDocument();
    // The default Spinner should not be rendered
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("forwards spinnerProps to Spinner", () => {
    render(
      <SpinnerOverlay spinning spinnerProps={{ label: "Custom loading" }}>
        <p>Content</p>
      </SpinnerOverlay>
    );
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Custom loading"
    );
  });

  it("applies blur style", () => {
    render(
      <SpinnerOverlay spinning blur={4}>
        <p>Content</p>
      </SpinnerOverlay>
    );
    const overlay = screen.getByTestId("spinner-overlay");
    expect(overlay.style.backdropFilter).toBe("blur(4px)");
  });

  it("merges className on wrapper", () => {
    const { container } = render(
      <SpinnerOverlay spinning className="custom-wrapper">
        <p>Content</p>
      </SpinnerOverlay>
    );
    expect(container.firstChild).toHaveClass("custom-wrapper");
    expect(container.firstChild).toHaveClass("relative");
  });

  it("renders inline spinner when no children are provided", () => {
    const { container } = render(<SpinnerOverlay spinning />);
    // Should render inline (not relative wrapper)
    expect(container.firstChild).toHaveClass("inline-flex");
    // Should still have a spinner
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows description in no-children mode", () => {
    render(<SpinnerOverlay spinning description="Standalone loading..." />);
    expect(screen.getByText("Standalone loading...")).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { StaggerGroup } from "../StaggerGroup";
import { AnimationProvider } from "../../animation/AnimationProvider";
import { expectNoA11yViolations } from "../../test/a11y";

// Helper to set up matchMedia mock
function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? prefersReducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeAll(() => {
  mockMatchMedia(false);

  global.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: readonly number[] = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
    constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
  } as unknown as typeof globalThis.IntersectionObserver;
});

afterEach(() => {
  // Reset matchMedia to default (no reduced motion)
  mockMatchMedia(false);
});

describe("StaggerGroup", () => {
  it("renders all children", () => {
    render(
      <StaggerGroup>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
    expect(screen.getByText("Child 3")).toBeInTheDocument();
  });

  it("applies className to the container", () => {
    const { container } = render(
      <StaggerGroup className="grid gap-4">
        <div>A</div>
        <div>B</div>
      </StaggerGroup>
    );
    expect(container.firstChild).toHaveClass("grid", "gap-4");
  });

  it("applies style to the container", () => {
    const { container } = render(
      <StaggerGroup style={{ padding: "10px" }}>
        <div>Styled</div>
      </StaggerGroup>
    );
    expect(container.firstChild).toHaveStyle({ padding: "10px" });
  });

  it("renders with show=true", () => {
    render(
      <StaggerGroup show={true}>
        <div>Visible</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("does not render children when show=false", () => {
    render(
      <StaggerGroup show={false}>
        <div>Hidden</div>
      </StaggerGroup>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("transitions from show=true to show=false", () => {
    const { rerender } = render(
      <StaggerGroup show={true}>
        <div>Transition</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Transition")).toBeInTheDocument();

    rerender(
      <StaggerGroup show={false}>
        <div>Transition</div>
      </StaggerGroup>
    );
    return waitFor(() => {
      expect(screen.queryByText("Transition")).not.toBeInTheDocument();
    });
  });

  it("renders with different presets", () => {
    const presetNames = ["fade", "fadeUp", "scale", "pop"] as const;
    for (const preset of presetNames) {
      const { unmount } = render(
        <StaggerGroup preset={preset}>
          <div>{preset}</div>
        </StaggerGroup>
      );
      expect(screen.getByText(preset)).toBeInTheDocument();
      unmount();
    }
  });

  it("accepts stagger as a number", () => {
    render(
      <StaggerGroup stagger={0.2}>
        <div>S1</div>
        <div>S2</div>
      </StaggerGroup>
    );
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("S2")).toBeInTheDocument();
  });

  it("accepts duration prop", () => {
    render(
      <StaggerGroup duration="slow">
        <div>Slow</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Slow")).toBeInTheDocument();
  });

  it("accepts easing prop", () => {
    render(
      <StaggerGroup easing="bounce">
        <div>Bounce</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Bounce")).toBeInTheDocument();
  });

  it("renders as a different element", () => {
    const { container } = render(
      <StaggerGroup as="ul">
        <li>Item</li>
      </StaggerGroup>
    );
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <StaggerGroup ref={ref}>
        <div>Ref</div>
      </StaggerGroup>
    );
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it("renders with viewport boolean", () => {
    render(
      <StaggerGroup viewport>
        <div>VP</div>
      </StaggerGroup>
    );
    expect(screen.getByText("VP")).toBeInTheDocument();
  });

  it("renders with viewport object", () => {
    render(
      <StaggerGroup viewport={{ once: true, amount: 0.5 }}>
        <div>VP obj</div>
      </StaggerGroup>
    );
    expect(screen.getByText("VP obj")).toBeInTheDocument();
  });

  // --- Accessibility (axe) ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <StaggerGroup preset="fadeUp">
        <p>Child 1</p>
        <p>Child 2</p>
      </StaggerGroup>
    );
    await expectNoA11yViolations(container);
  });
});

describe("StaggerGroup with disabled provider", () => {
  it("renders children when animations are disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <StaggerGroup preset="fadeUp">
          <div>Disabled 1</div>
          <div>Disabled 2</div>
        </StaggerGroup>
      </AnimationProvider>
    );
    expect(screen.getByText("Disabled 1")).toBeInTheDocument();
    expect(screen.getByText("Disabled 2")).toBeInTheDocument();
  });

  it("show=false hides content when disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <StaggerGroup show={false}>
          <div>Hidden disabled</div>
        </StaggerGroup>
      </AnimationProvider>
    );
    expect(screen.queryByText("Hidden disabled")).not.toBeInTheDocument();
  });
});

/* ─── Reduced motion fallback (no provider) ── */

describe("StaggerGroup with reduced motion (no provider)", () => {
  it("renders children with reduced motion", () => {
    mockMatchMedia(true);
    render(
      <StaggerGroup preset="fadeUp">
        <div>Reduced 1</div>
        <div>Reduced 2</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Reduced 1")).toBeInTheDocument();
    expect(screen.getByText("Reduced 2")).toBeInTheDocument();
  });

  it("still shows content when show=true with reduced motion", () => {
    mockMatchMedia(true);
    render(
      <StaggerGroup preset="fadeUp" show={true}>
        <div>Visible reduced</div>
      </StaggerGroup>
    );
    expect(screen.getByText("Visible reduced")).toBeInTheDocument();
  });

  it("still hides content when show=false with reduced motion", () => {
    mockMatchMedia(true);
    render(
      <StaggerGroup preset="fadeUp" show={false}>
        <div>Hidden reduced</div>
      </StaggerGroup>
    );
    expect(screen.queryByText("Hidden reduced")).not.toBeInTheDocument();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { Animate, Fade, Slide, Scale, ScaleFade, Collapse, Pop } from "../Animate";
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

// Mock matchMedia for useReducedMotion
beforeAll(() => {
  mockMatchMedia(false);

  // Mock IntersectionObserver for viewport tests
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

describe("Animate", () => {
  it("renders children", () => {
    render(<Animate>Hello</Animate>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders with a preset", () => {
    render(<Animate preset="fadeUp">Content</Animate>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies className", () => {
    const { container } = render(
      <Animate className="custom-class">Test</Animate>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies style", () => {
    const { container } = render(
      <Animate style={{ color: "red" }}>Test</Animate>
    );
    expect(container.firstChild).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("renders when show=true", () => {
    render(<Animate preset="fade" show={true}>Visible</Animate>);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("does not render children when show=false", () => {
    render(<Animate preset="fade" show={false}>Hidden</Animate>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("accepts custom initial/animate/exit", () => {
    render(
      <Animate
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Custom
      </Animate>
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Animate ref={ref}>Ref test</Animate>);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it("renders as a different element", () => {
    const { container } = render(<Animate as="span">Span</Animate>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders with all presets without errors", () => {
    const presetNames = [
      "fade", "fadeUp", "fadeDown", "fadeLeft", "fadeRight",
      "slideUp", "slideDown", "slideLeft", "slideRight",
      "scale", "scaleUp", "collapse", "pop",
    ] as const;

    for (const preset of presetNames) {
      const { unmount } = render(
        <Animate preset={preset}>{preset}</Animate>
      );
      expect(screen.getByText(preset)).toBeInTheDocument();
      unmount();
    }
  });

  it("accepts duration as a token name", () => {
    render(<Animate preset="fade" duration="slow">Duration token</Animate>);
    expect(screen.getByText("Duration token")).toBeInTheDocument();
  });

  it("accepts duration as a number", () => {
    render(<Animate preset="fade" duration={0.5}>Duration number</Animate>);
    expect(screen.getByText("Duration number")).toBeInTheDocument();
  });

  it("accepts easing as a token name", () => {
    render(<Animate preset="fade" easing="bounce">Easing token</Animate>);
    expect(screen.getByText("Easing token")).toBeInTheDocument();
  });

  it("accepts easing as a numeric array", () => {
    render(
      <Animate preset="fade" easing={[0.2, 0.8, 0.4, 1]}>
        Easing array
      </Animate>
    );
    expect(screen.getByText("Easing array")).toBeInTheDocument();
  });

  it("accepts delay prop", () => {
    render(<Animate preset="fade" delay={0.3}>Delayed</Animate>);
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });

  it("renders with viewport boolean", () => {
    render(<Animate preset="fadeUp" viewport>Viewport</Animate>);
    expect(screen.getByText("Viewport")).toBeInTheDocument();
  });

  it("renders with viewport object", () => {
    render(
      <Animate preset="fadeUp" viewport={{ once: true, amount: 0.5 }}>
        Viewport obj
      </Animate>
    );
    expect(screen.getByText("Viewport obj")).toBeInTheDocument();
  });

  // --- Accessibility (axe) ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Animate preset="fadeUp">
        <p>Content for a11y check</p>
      </Animate>
    );
    await expectNoA11yViolations(container);
  });
});

/* ─── Disabled via provider ────────────────── */

describe("Animate with disabled provider", () => {
  it("still renders children when disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <Animate preset="fadeUp">Disabled</Animate>
      </AnimationProvider>
    );
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("show=true still shows content when disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <Animate preset="fadeUp" show={true}>
          Shown
        </Animate>
      </AnimationProvider>
    );
    expect(screen.getByText("Shown")).toBeInTheDocument();
  });

  it("show=false still hides content when disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <Animate preset="fadeUp" show={false}>
          Hidden
        </Animate>
      </AnimationProvider>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });
});

/* ─── Reduced motion fallback (no provider) ── */

describe("Animate with reduced motion (no provider)", () => {
  it("renders children with reduced motion", () => {
    mockMatchMedia(true);
    render(<Animate preset="fadeUp">Reduced motion</Animate>);
    expect(screen.getByText("Reduced motion")).toBeInTheDocument();
  });

  it("still shows content when show=true with reduced motion", () => {
    mockMatchMedia(true);
    render(<Animate preset="fadeUp" show={true}>Visible reduced</Animate>);
    expect(screen.getByText("Visible reduced")).toBeInTheDocument();
  });

  it("still hides content when show=false with reduced motion", () => {
    mockMatchMedia(true);
    render(<Animate preset="fadeUp" show={false}>Hidden reduced</Animate>);
    expect(screen.queryByText("Hidden reduced")).not.toBeInTheDocument();
  });
});

/* ─── Named wrappers ──────────────────────── */

describe("Fade", () => {
  it("renders children", () => {
    render(<Fade>Fade content</Fade>);
    expect(screen.getByText("Fade content")).toBeInTheDocument();
  });

  it("handles show prop", () => {
    const { rerender } = render(<Fade show={true}>Fade show</Fade>);
    expect(screen.getByText("Fade show")).toBeInTheDocument();
    rerender(<Fade show={false}>Fade show</Fade>);
    return waitFor(() => {
      expect(screen.queryByText("Fade show")).not.toBeInTheDocument();
    });
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Fade ref={ref}>Ref</Fade>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Slide", () => {
  it("renders children", () => {
    render(<Slide>Slide content</Slide>);
    expect(screen.getByText("Slide content")).toBeInTheDocument();
  });

  it("renders all directions", () => {
    for (const dir of ["up", "down", "left", "right"] as const) {
      const { unmount } = render(<Slide direction={dir}>{dir}</Slide>);
      expect(screen.getByText(dir)).toBeInTheDocument();
      unmount();
    }
  });

  it("defaults to up direction", () => {
    render(<Slide>Default up</Slide>);
    expect(screen.getByText("Default up")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Slide ref={ref}>Ref</Slide>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Scale", () => {
  it("renders children", () => {
    render(<Scale>Scale content</Scale>);
    expect(screen.getByText("Scale content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Scale ref={ref}>Ref</Scale>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("ScaleFade", () => {
  it("renders children", () => {
    render(<ScaleFade>ScaleFade content</ScaleFade>);
    expect(screen.getByText("ScaleFade content")).toBeInTheDocument();
  });

  it("handles show/hide", () => {
    const { rerender } = render(<ScaleFade show={true}>ScaleFade show</ScaleFade>);
    expect(screen.getByText("ScaleFade show")).toBeInTheDocument();
    rerender(<ScaleFade show={false}>ScaleFade show</ScaleFade>);
    return waitFor(() => {
      expect(screen.queryByText("ScaleFade show")).not.toBeInTheDocument();
    });
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ScaleFade ref={ref}>Ref</ScaleFade>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Collapse", () => {
  it("renders children", () => {
    render(<Collapse>Collapse content</Collapse>);
    expect(screen.getByText("Collapse content")).toBeInTheDocument();
  });

  it("hides content when show=false", () => {
    render(<Collapse show={false}>Collapse hidden</Collapse>);
    expect(screen.queryByText("Collapse hidden")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Collapse ref={ref}>Ref</Collapse>);
    expect(ref).toHaveBeenCalled();
  });
});

describe("Pop", () => {
  it("renders children", () => {
    render(<Pop>Pop content</Pop>);
    expect(screen.getByText("Pop content")).toBeInTheDocument();
  });

  it("handles show prop", () => {
    render(<Pop show={true}>Pop show</Pop>);
    expect(screen.getByText("Pop show")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Pop ref={ref}>Ref</Pop>);
    expect(ref).toHaveBeenCalled();
  });
});

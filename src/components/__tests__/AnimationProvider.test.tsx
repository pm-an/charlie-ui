import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import {
  AnimationProvider,
  useAnimationConfig,
} from "../../animation/AnimationProvider";

// Base matchMedia mock for tests that don't need reduced motion
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

/* Helper that renders the context value as text for assertions */
function ContextReader() {
  const ctx = useAnimationConfig();
  return (
    <div data-testid="ctx">
      <span data-testid="enabled">{String(ctx.enabled)}</span>
      <span data-testid="reduced">{String(ctx.prefersReducedMotion)}</span>
      {ctx.duration !== undefined && (
        <span data-testid="duration">{String(ctx.duration)}</span>
      )}
      {ctx.easing !== undefined && (
        <span data-testid="easing">{ctx.easing}</span>
      )}
    </div>
  );
}

describe("AnimationProvider", () => {
  it("defaults to enabled", () => {
    render(
      <AnimationProvider>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("enabled").textContent).toBe("true");
  });

  it("can be explicitly disabled", () => {
    render(
      <AnimationProvider config={{ enabled: false }}>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("enabled").textContent).toBe("false");
  });

  it("passes through duration config", () => {
    render(
      <AnimationProvider config={{ duration: "slow" }}>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("duration").textContent).toBe("slow");
  });

  it("passes through easing config", () => {
    render(
      <AnimationProvider config={{ easing: "bounce" }}>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("easing").textContent).toBe("bounce");
  });

  it("renders children", () => {
    render(
      <AnimationProvider>
        <span>Child</span>
      </AnimationProvider>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});

describe("AnimationProvider with reduced motion", () => {
  let matchMediaListeners: Map<string, (e: MediaQueryListEvent) => void>;
  let matchMediaMatches: boolean;

  beforeEach(() => {
    matchMediaListeners = new Map();
    matchMediaMatches = false;

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: matchMediaMatches,
      media: query,
      addEventListener: (_: string, handler: (e: MediaQueryListEvent) => void) => {
        matchMediaListeners.set(query, handler);
      },
      removeEventListener: () => {
        matchMediaListeners.delete("(prefers-reduced-motion: reduce)");
      },
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables animations when reduced motion is active", () => {
    matchMediaMatches = true;

    render(
      <AnimationProvider config={{ respectReducedMotion: true }}>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("enabled").textContent).toBe("false");
    expect(screen.getByTestId("reduced").textContent).toBe("true");
  });

  it("keeps animations enabled when respectReducedMotion=false even if OS says reduce", () => {
    matchMediaMatches = true;

    render(
      <AnimationProvider config={{ respectReducedMotion: false }}>
        <ContextReader />
      </AnimationProvider>
    );
    expect(screen.getByTestId("enabled").textContent).toBe("true");
  });

  it("responds to media query changes", () => {
    matchMediaMatches = false;

    render(
      <AnimationProvider>
        <ContextReader />
      </AnimationProvider>
    );

    expect(screen.getByTestId("enabled").textContent).toBe("true");

    // Simulate OS preference change
    act(() => {
      const listener = matchMediaListeners.get(
        "(prefers-reduced-motion: reduce)"
      );
      if (listener) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(screen.getByTestId("enabled").textContent).toBe("false");
  });
});

describe("useAnimationConfig outside provider", () => {
  it("returns default context (enabled=true)", () => {
    render(<ContextReader />);
    expect(screen.getByTestId("enabled").textContent).toBe("true");
  });
});

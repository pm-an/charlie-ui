import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useReducedMotion } from "../../animation/useReducedMotion";

function TestComponent() {
  const reduced = useReducedMotion();
  return <span data-testid="reduced">{String(reduced)}</span>;
}

describe("useReducedMotion", () => {
  let listeners: Map<string, (e: MediaQueryListEvent) => void>;
  let matches: boolean;

  beforeEach(() => {
    listeners = new Map();
    matches = false;

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches,
      media: query,
      addEventListener: (_: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.set(query, handler);
      },
      removeEventListener: () => {
        listeners.delete("(prefers-reduced-motion: reduce)");
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

  it("returns false when reduced motion is not preferred", () => {
    matches = false;
    render(<TestComponent />);
    expect(screen.getByTestId("reduced").textContent).toBe("false");
  });

  it("returns true when reduced motion is preferred", () => {
    matches = true;
    render(<TestComponent />);
    expect(screen.getByTestId("reduced").textContent).toBe("true");
  });

  it("updates when the media query changes", () => {
    matches = false;
    render(<TestComponent />);
    expect(screen.getByTestId("reduced").textContent).toBe("false");

    act(() => {
      const listener = listeners.get("(prefers-reduced-motion: reduce)");
      if (listener) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(screen.getByTestId("reduced").textContent).toBe("true");
  });

  it("cleans up event listener on unmount", () => {
    matches = false;
    const { unmount } = render(<TestComponent />);

    expect(listeners.has("(prefers-reduced-motion: reduce)")).toBe(true);
    unmount();
    expect(listeners.has("(prefers-reduced-motion: reduce)")).toBe(false);
  });
});

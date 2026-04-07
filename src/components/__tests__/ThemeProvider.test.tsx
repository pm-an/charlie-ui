import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { ThemeProvider, useTheme, useColorMode } from "../ThemeProvider";

// matchMedia is not available in jsdom — provide a default mock
beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }
});

function ThemeDisplay() {
  const theme = useTheme();
  const mode = useColorMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="bg">{theme.bg}</span>
      <span data-testid="accent">{theme.accent}</span>
      <span data-testid="text-loud">{theme.textLoud}</span>
      <span data-testid="bg-subtle">{theme.bgSubtle}</span>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("defaults to dark mode", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    expect(container.querySelector("[data-charlie-mode]")).toHaveAttribute(
      "data-charlie-mode",
      "dark"
    );
  });

  it("applies user theme overrides", () => {
    render(
      <ThemeProvider theme={{ accent: "#6366f1" }}>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("accent")).toHaveTextContent("#6366f1");
  });

  it("sets CSS custom properties as inline styles", () => {
    const { container } = render(
      <ThemeProvider theme={{ accent: "#6366f1" }}>
        <div>test</div>
      </ThemeProvider>
    );
    const wrapper = container.querySelector("[data-charlie-mode]") as HTMLElement;
    expect(wrapper.style.getPropertyValue("--charlie-accent")).toBe("#6366f1");
  });

  it("merges nested ThemeProviders", () => {
    render(
      <ThemeProvider theme={{ accent: "#dc2626", bg: "#000" }}>
        <ThemeProvider theme={{ accent: "#6366f1" }}>
          <ThemeDisplay />
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("accent")).toHaveTextContent("#6366f1");
    expect(screen.getByTestId("bg")).toHaveTextContent("#000");
  });
});

describe("ThemeProvider mode='light'", () => {
  it("applies light theme base tokens", () => {
    render(
      <ThemeProvider mode="light">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    expect(screen.getByTestId("bg")).toHaveTextContent("#ffffff");
    expect(screen.getByTestId("text-loud")).toHaveTextContent("#030712");
  });

  it("sets data-charlie-mode to light", () => {
    const { container } = render(
      <ThemeProvider mode="light">
        <div>test</div>
      </ThemeProvider>
    );
    expect(container.querySelector("[data-charlie-mode]")).toHaveAttribute(
      "data-charlie-mode",
      "light"
    );
  });

  it("user theme overrides win over lightThemeBase", () => {
    render(
      <ThemeProvider mode="light" theme={{ accent: "#10b981" }}>
        <ThemeDisplay />
      </ThemeProvider>
    );
    // accent overridden by user
    expect(screen.getByTestId("accent")).toHaveTextContent("#10b981");
    // bg still comes from lightThemeBase
    expect(screen.getByTestId("bg")).toHaveTextContent("#ffffff");
  });

  it("sets light shadow CSS vars", () => {
    const { container } = render(
      <ThemeProvider mode="light">
        <div>test</div>
      </ThemeProvider>
    );
    const wrapper = container.querySelector("[data-charlie-mode]") as HTMLElement;
    const shadowCard = wrapper.style.getPropertyValue("--charlie-shadow-card");
    expect(shadowCard).toBeTruthy();
    // Light shadows don't have inset white highlights
    expect(shadowCard).not.toContain("rgba(255, 255, 255");
  });

  it("sets new semantic token CSS vars", () => {
    const { container } = render(
      <ThemeProvider mode="light">
        <div>test</div>
      </ThemeProvider>
    );
    const wrapper = container.querySelector("[data-charlie-mode]") as HTMLElement;
    expect(wrapper.style.getPropertyValue("--charlie-bg-subtle")).toBe(
      "rgba(0, 0, 0, 0.04)"
    );
    expect(wrapper.style.getPropertyValue("--charlie-overlay")).toBe(
      "rgba(0, 0, 0, 0.3)"
    );
  });
});

describe("ThemeProvider mode='dark'", () => {
  it("does not apply lightThemeBase", () => {
    render(
      <ThemeProvider mode="dark">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    // bg should NOT be the light value
    expect(screen.getByTestId("bg")).not.toHaveTextContent("#ffffff");
  });
});

describe("ThemeProvider nested modes", () => {
  it("inner light mode overrides outer dark mode", () => {
    render(
      <ThemeProvider mode="dark" theme={{ accent: "#dc2626" }}>
        <ThemeProvider mode="light">
          <ThemeDisplay />
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    expect(screen.getByTestId("bg")).toHaveTextContent("#ffffff");
  });

  it("inner dark mode overrides outer light mode", () => {
    render(
      <ThemeProvider mode="light">
        <ThemeProvider mode="dark" theme={{ bg: "#07080a" }}>
          <ThemeDisplay />
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    expect(screen.getByTestId("bg")).toHaveTextContent("#07080a");
  });
});

describe("ThemeProvider mode='system'", () => {
  let listeners: Array<(e: { matches: boolean }) => void>;
  let matchesDark: boolean;

  beforeEach(() => {
    listeners = [];
    matchesDark = true;
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)" ? matchesDark : false,
        media: query,
        addEventListener: (_: string, handler: (e: { matches: boolean }) => void) => {
          listeners.push(handler);
        },
        removeEventListener: (_: string, handler: (e: { matches: boolean }) => void) => {
          listeners = listeners.filter((l) => l !== handler);
        },
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves to dark when system prefers dark", () => {
    matchesDark = true;
    render(
      <ThemeProvider mode="system">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("resolves to light when system prefers light", () => {
    matchesDark = false;
    render(
      <ThemeProvider mode="system">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    expect(screen.getByTestId("bg")).toHaveTextContent("#ffffff");
  });

  it("reacts to system color scheme changes", () => {
    matchesDark = true;
    render(
      <ThemeProvider mode="system">
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");

    act(() => {
      for (const listener of listeners) {
        listener({ matches: false });
      }
    });
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });
});

describe("useColorMode without provider", () => {
  it("defaults to dark", () => {
    function ModeOnly() {
      const mode = useColorMode();
      return <span data-testid="mode">{mode}</span>;
    }
    render(<ModeOnly />);
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });
});

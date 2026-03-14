import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function ThemeConsumer() {
  const theme = useTheme();
  return <span data-testid="theme">{JSON.stringify(theme)}</span>;
}

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("provides theme values to consumers", () => {
    render(
      <ThemeProvider theme={{ accent: "#ff0000" }}>
        <ThemeConsumer />
      </ThemeProvider>
    );
    const themeData = JSON.parse(screen.getByTestId("theme").textContent!);
    expect(themeData.accent).toBe("#ff0000");
  });

  it("sets CSS custom properties on wrapper div", () => {
    const { container } = render(
      <ThemeProvider theme={{ accent: "#6366f1" }}>
        <span>Test</span>
      </ThemeProvider>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue("--charlie-accent")).toBe("#6366f1");
  });

  it("merges parent and child themes when nested", () => {
    render(
      <ThemeProvider theme={{ accent: "#ff0000", bg: "#000000" }}>
        <ThemeProvider theme={{ accent: "#0000ff" }}>
          <ThemeConsumer />
        </ThemeProvider>
      </ThemeProvider>
    );
    const themeData = JSON.parse(screen.getByTestId("theme").textContent!);
    expect(themeData.accent).toBe("#0000ff");
    expect(themeData.bg).toBe("#000000");
  });

  it("applies className to wrapper div", () => {
    const { container } = render(
      <ThemeProvider className="custom-wrapper">
        <span>Test</span>
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass("custom-wrapper");
  });

  it("uses contents display class", () => {
    const { container } = render(
      <ThemeProvider>
        <span>Test</span>
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveClass("contents");
  });
});

describe("useTheme", () => {
  it("returns empty object when no provider", () => {
    render(<ThemeConsumer />);
    const themeData = JSON.parse(screen.getByTestId("theme").textContent!);
    expect(themeData).toEqual({});
  });
});

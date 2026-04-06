import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Kbd, resolveKey, KEY_SYMBOLS } from "./Kbd";

describe("Kbd", () => {
  it("renders as a kbd element", () => {
    render(<Kbd>K</Kbd>);
    const el = screen.getByText("K");
    expect(el.tagName).toBe("KBD");
  });

  it("renders children", () => {
    render(<Kbd>A</Kbd>);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Kbd className="my-kbd">K</Kbd>);
    expect(screen.getByText("K")).toHaveClass("my-kbd");
  });

  it("passes through HTML attributes", () => {
    render(<Kbd data-testid="kbd-test" title="keyboard shortcut">K</Kbd>);
    expect(screen.getByTestId("kbd-test")).toHaveAttribute("title", "keyboard shortcut");
  });

  describe("auto key symbol mapping", () => {
    it.each([
      ["cmd", "⌘"],
      ["command", "⌘"],
      ["meta", "⌘"],
      ["ctrl", "⌃"],
      ["control", "⌃"],
      ["alt", "⌥"],
      ["option", "⌥"],
      ["shift", "⇧"],
      ["enter", "↵"],
      ["return", "↵"],
      ["tab", "⇥"],
      ["escape", "⎋"],
      ["esc", "⎋"],
      ["backspace", "⌫"],
      ["delete", "⌦"],
      ["space", "␣"],
      ["up", "↑"],
      ["down", "↓"],
      ["left", "←"],
      ["right", "→"],
      ["capslock", "⇪"],
      ["home", "↖"],
      ["end", "↘"],
      ["pageup", "⇞"],
      ["pagedown", "⇟"],
    ])("maps '%s' to '%s'", (input, expected) => {
      render(<Kbd>{input}</Kbd>);
      expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it("maps case-insensitively", () => {
      render(<Kbd>CMD</Kbd>);
      expect(screen.getByText("⌘")).toBeInTheDocument();
    });

    it("passes through unmapped keys as-is", () => {
      render(<Kbd>K</Kbd>);
      expect(screen.getByText("K")).toBeInTheDocument();
    });

    it("maps function keys", () => {
      render(<Kbd>f1</Kbd>);
      expect(screen.getByText("F1")).toBeInTheDocument();
    });

    it("does not map ReactNode children (non-string)", () => {
      render(<Kbd><span data-testid="custom">icon</span></Kbd>);
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });
  });

  describe("keys prop (combo)", () => {
    it("renders multiple keys from keys array", () => {
      render(<Kbd keys={["cmd", "K"]} />);
      expect(screen.getByText("⌘")).toBeInTheDocument();
      expect(screen.getByText("K")).toBeInTheDocument();
    });

    it("renders each key as a separate kbd element", () => {
      const { container } = render(<Kbd keys={["cmd", "shift", "P"]} />);
      const kbds = container.querySelectorAll("kbd");
      expect(kbds).toHaveLength(3);
      expect(kbds[0].textContent).toBe("⌘");
      expect(kbds[1].textContent).toBe("⇧");
      expect(kbds[2].textContent).toBe("P");
    });

    it("wraps combo in a span (not kbd)", () => {
      const { container } = render(<Kbd keys={["cmd", "K"]} />);
      expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("renders separator between keys", () => {
      render(<Kbd keys={["cmd", "K"]} separator="+" />);
      expect(screen.getByText("+")).toBeInTheDocument();
    });

    it("does not render separator before first key", () => {
      const { container } = render(<Kbd keys={["cmd", "K"]} separator="+" />);
      const separators = container.querySelectorAll(".text-\\[10px\\].text-fg-200");
      expect(separators).toHaveLength(1); // only between, not before first
    });
  });

  describe("sizes", () => {
    it("applies md size by default", () => {
      render(<Kbd>K</Kbd>);
      expect(screen.getByText("K")).toHaveClass("text-[11px]");
    });

    it("applies sm size", () => {
      render(<Kbd size="sm">K</Kbd>);
      expect(screen.getByText("K")).toHaveClass("text-[10px]");
    });

    it("applies lg size", () => {
      render(<Kbd size="lg">K</Kbd>);
      expect(screen.getByText("K")).toHaveClass("text-xs");
    });

    it("applies size to all keys in combo", () => {
      const { container } = render(<Kbd keys={["cmd", "K"]} size="lg" />);
      const kbds = container.querySelectorAll("kbd");
      kbds.forEach((kbd) => {
        expect(kbd).toHaveClass("text-xs");
      });
    });
  });

  describe("resolveKey utility", () => {
    it("resolves known keys", () => {
      expect(resolveKey("cmd")).toBe("⌘");
      expect(resolveKey("shift")).toBe("⇧");
    });

    it("is case-insensitive", () => {
      expect(resolveKey("CMD")).toBe("⌘");
      expect(resolveKey("Shift")).toBe("⇧");
    });

    it("returns original for unknown keys", () => {
      expect(resolveKey("A")).toBe("A");
      expect(resolveKey("Z")).toBe("Z");
    });
  });

  describe("KEY_SYMBOLS", () => {
    it("exports a non-empty mapping", () => {
      expect(Object.keys(KEY_SYMBOLS).length).toBeGreaterThan(20);
    });
  });
});

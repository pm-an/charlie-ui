import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

// ---------------------------------------------------------------------------
// Key symbol mapping — maps key names to platform-appropriate symbols
// ---------------------------------------------------------------------------

const KEY_SYMBOLS: Record<string, string> = {
  // Modifiers
  cmd: "⌘",
  command: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  opt: "⌥",
  shift: "⇧",
  // Navigation
  enter: "↵",
  return: "↵",
  tab: "⇥",
  escape: "⎋",
  esc: "⎋",
  backspace: "⌫",
  delete: "⌦",
  del: "⌦",
  space: "␣",
  // Arrows
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  // System
  capslock: "⇪",
  fn: "fn",
  home: "↖",
  end: "↘",
  pageup: "⇞",
  pagedown: "⇟",
  // Function keys (display as-is but uppercased)
  f1: "F1",
  f2: "F2",
  f3: "F3",
  f4: "F4",
  f5: "F5",
  f6: "F6",
  f7: "F7",
  f8: "F8",
  f9: "F9",
  f10: "F10",
  f11: "F11",
  f12: "F12",
};

/** Resolve a key name to its display symbol. Returns the original string if no mapping exists. */
function resolveKey(key: string): string {
  return KEY_SYMBOLS[key.toLowerCase()] ?? key;
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const kbdVariants = cva(
  [
    "inline-flex items-center justify-center",
    "bg-bg-subtle border border-border-strong rounded-[4px]",
    "font-mono text-fg-200",
    "shadow-xs",
  ],
  {
    variants: {
      size: {
        sm: "min-w-[18px] h-[18px] px-1 text-[10px]",
        md: "min-w-[22px] h-[22px] px-1.5 py-0.5 text-[11px]",
        lg: "min-w-[28px] h-[28px] px-2 py-1 text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type KbdProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof kbdVariants> & {
    /**
     * Array of key names to render as a shortcut combo.
     * Keys are auto-mapped to symbols (e.g., "cmd" → "⌘", "shift" → "⇧").
     * Individual keys are rendered as separate `<kbd>` elements joined by a separator.
     *
     * @example
     * <Kbd keys={["cmd", "shift", "P"]} />
     * // Renders: ⌘ ⇧ P
     */
    keys?: string[];
    /**
     * Separator between keys when using `keys` prop.
     * @default "" (no separator, just gap)
     */
    separator?: ReactNode;
  };

function Kbd({
  className,
  children,
  keys,
  separator,
  size,
  ...props
}: KbdProps) {
  // If `keys` prop is provided, render a combo of key badges
  if (keys && keys.length > 0) {
    return (
      <span
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      >
        {keys.map((key, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            {i > 0 && separator && (
              <span className="text-[10px] text-fg-200">{separator}</span>
            )}
            <kbd
              data-slot="kbd"
              className={cn(kbdVariants({ size }))}
            >
              {resolveKey(key)}
            </kbd>
          </span>
        ))}
      </span>
    );
  }

  // Single key or custom children
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ size }), className)}
      {...props}
    >
      {typeof children === "string" ? resolveKey(children) : children}
    </kbd>
  );
}

Kbd.displayName = "Kbd";

export { Kbd, kbdVariants, resolveKey, KEY_SYMBOLS };

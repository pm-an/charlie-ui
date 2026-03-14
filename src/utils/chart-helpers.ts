/**
 * Shared chart utilities — color mapping, tooltip/grid styling.
 *
 * NOTE: Recharts renders SVG elements with stroke/fill as XML attributes,
 * which do NOT support CSS `var()`. We resolve CSS custom properties to
 * computed hex values at runtime, with hardcoded fallbacks for SSR/tests.
 */

/** CSS variable name → hardcoded fallback (matches default theme). */
const colorDefs: Record<string, { cssVar: string; fallback: string }> = {
  accent: { cssVar: "--color-accent", fallback: "#ff6363" },
  blue: { cssVar: "--color-blue", fallback: "#56c2ff" },
  green: { cssVar: "--color-green", fallback: "#59d499" },
  yellow: { cssVar: "--color-yellow", fallback: "#ffa500" },
  red: { cssVar: "--color-red", fallback: "#ff6363" },
  purple: { cssVar: "--color-purple", fallback: "#9b4dff" },
  orange: { cssVar: "--color-orange", fallback: "#ff9217" },
};

/** Default color cycle used when no explicit color is given. */
export const defaultColorCycle = [
  "accent",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "red",
] as const;

/** Read a CSS custom property from the document, returns empty string if unavailable. */
function readCSSVar(varName: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Resolve a color name (like "accent") or raw CSS value (like "#ff0")
 * into an actual color string usable as an SVG attribute.
 */
export function resolveChartColor(color: string | undefined, index: number): string {
  const key = color ?? defaultColorCycle[index % defaultColorCycle.length];
  const def = colorDefs[key];
  if (def) {
    return readCSSVar(def.cssVar) || def.fallback;
  }
  // Raw color value passed directly (e.g. "#61DAFB")
  return key;
}

/* ─── Font ──────────────────────────────────────────── */

const FONT_FALLBACK =
  '"Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/** Resolve the library's --font-sans at runtime. */
function getFontFamily(): string {
  return readCSSVar("--font-sans") || FONT_FALLBACK;
}

/* ─── Tooltip (HTML div — CSS vars work here) ───────── */

export function getTooltipStyles() {
  const fontFamily = getFontFamily();
  return {
    contentStyle: {
      backgroundColor: "var(--color-surface-elevated, #111214)",
      border: "1px solid var(--color-border, rgba(255,255,255,0.06))",
      borderRadius: "var(--radius-md, 8px)",
      padding: "8px 12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      fontFamily,
    } satisfies React.CSSProperties,
    labelStyle: {
      color: "var(--color-text-loud, #ffffff)",
      fontWeight: 600,
      fontSize: 13,
      marginBottom: 2,
      fontFamily,
    } satisfies React.CSSProperties,
    itemStyle: {
      color: "var(--color-text-default, #9c9c9d)",
      fontSize: 13,
      padding: 0,
      fontFamily,
    } satisfies React.CSSProperties,
  };
}

/* ─── Axis ticks (SVG text — must resolve vars) ─────── */

export function getAxisTickStyle(): Record<string, string | number> {
  return {
    fill: readCSSVar("--color-text-muted") || "#6a6b6c",
    fontSize: 12,
    fontFamily: getFontFamily(),
  };
}

/* ─── Legend (HTML — CSS vars work) ─────────────────── */

export function getLegendStyle(): React.CSSProperties {
  return {
    color: "var(--color-text-muted, #6a6b6c)",
    fontSize: 13,
    fontFamily: getFontFamily(),
  };
}

/* ─── Grid ──────────────────────────────────────────── */

/** Grid stroke for CartesianGrid / PolarGrid — matches --color-border. */
export const gridStroke = "rgba(255,255,255,0.06)";

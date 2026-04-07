import type { CharlieTheme } from "../components/ThemeProvider";

/**
 * @deprecated Dark base tokens now live in theme.css @theme block.
 * Pass only custom overrides (accent, brand) to ThemeProvider.
 */
export const defaultTheme: CharlieTheme = {};

/** Indigo accent theme */
export const indigoTheme: CharlieTheme = {
  accent: "#6366f1",
  accentMuted: "#1e1b4b",
  accentDim: "#4338ca",
};

/** Ocean blue accent theme */
export const oceanTheme: CharlieTheme = {
  accent: "#0ea5e9",
  accentMuted: "#0c2d48",
  accentDim: "#0284c7",
  blue: "#38bdf8",
};

/** Emerald accent theme */
export const emeraldTheme: CharlieTheme = {
  accent: "#10b981",
  accentMuted: "#0d3b2e",
  accentDim: "#059669",
};

/** Amber accent theme */
export const amberTheme: CharlieTheme = {
  accent: "#f59e0b",
  accentMuted: "#3b2506",
  accentDim: "#d97706",
};

/** Rose accent theme */
export const roseTheme: CharlieTheme = {
  accent: "#f43f5e",
  accentMuted: "#2c0f1a",
  accentDim: "#e11d48",
};

/** Violet accent theme */
export const violetTheme: CharlieTheme = {
  accent: "#8b5cf6",
  accentMuted: "#1e1145",
  accentDim: "#7c3aed",
  purple: "#a78bfa",
};

/**
 * @deprecated Light base tokens now live in theme.css [data-charlie-mode="light"] block.
 * Use <ThemeProvider mode="light"> instead.
 */
export const lightThemeBase: CharlieTheme = {};

/** @deprecated Use <ThemeProvider mode="light"> with accent overrides */
export const lightTheme: CharlieTheme = {};

/** Light-mode accentMuted values for each accent preset */
export const lightAccentMuted: Record<string, string> = {
  indigo: "#eef2ff",
  ocean: "#e0f2fe",
  emerald: "#ecfdf5",
  amber: "#fffbeb",
  rose: "#fff1f2",
  violet: "#f5f3ff",
};

/** Indigo accent optimized for light mode */
export const indigoLightTheme: CharlieTheme = {
  ...indigoTheme,
  accentMuted: "#eef2ff",
};

/** Ocean accent optimized for light mode */
export const oceanLightTheme: CharlieTheme = {
  ...oceanTheme,
  accentMuted: "#e0f2fe",
};

/** Emerald accent optimized for light mode */
export const emeraldLightTheme: CharlieTheme = {
  ...emeraldTheme,
  accentMuted: "#ecfdf5",
};

/** Amber accent optimized for light mode */
export const amberLightTheme: CharlieTheme = {
  ...amberTheme,
  accentMuted: "#fffbeb",
};

/** Rose accent optimized for light mode */
export const roseLightTheme: CharlieTheme = {
  ...roseTheme,
  accentMuted: "#fff1f2",
};

/** Violet accent optimized for light mode */
export const violetLightTheme: CharlieTheme = {
  ...violetTheme,
  accentMuted: "#f5f3ff",
};

/**
 * Create a custom theme with accent/brand overrides.
 * Dark/light base tokens come from CSS — only pass what you want to customize.
 *
 * ```ts
 * const myTheme = createTheme({ accent: "#208C7F", accentMuted: "#E6F4F2" });
 * ```
 */
export function createTheme(overrides: CharlieTheme): CharlieTheme {
  return overrides;
}

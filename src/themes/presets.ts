import type { CharlieTheme } from "../components/ThemeProvider";

/** Default Charlie UI theme (Raycast-inspired dark) */
export const defaultTheme: CharlieTheme = {
  accent: "#ff6363",
  accentMuted: "#2c1617",
  accentDim: "#833637",
  bg: "#07080a",
  surface: "#1b1c1e",
  surfaceElevated: "#111214",
  fg: "#f4f4f5",
  textLoud: "#ffffff",
  textDefault: "#9c9c9d",
  textMuted: "#6a6b6c",
};

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
 * Helper to create a custom theme by overriding the default.
 *
 * Usage:
 * ```ts
 * const myTheme = createTheme({
 *   accent: "#ff6347",
 *   bg: "#0a0a0a",
 * });
 * ```
 */
export function createTheme(overrides: CharlieTheme): CharlieTheme {
  return { ...defaultTheme, ...overrides };
}

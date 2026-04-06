import type { CharlieTheme } from "../components/ThemeProvider";

/** Default Charlie UI theme */
export const defaultTheme: CharlieTheme = {
  accent: "#ef4444",
  accentMuted: "#2c1617",
  accentDim: "#dc2626",
  bg: "#07080a",
  surface: "#1b1c1e",
  surfaceElevated: "#111214",
  fg: "#f4f4f5",
  textLoud: "#ffffff",
  textDefault: "#9c9c9d",
  textMuted: "#6a6b6c",
  bgSubtle: "rgba(255, 255, 255, 0.05)",
  bgSubtleHover: "rgba(255, 255, 255, 0.08)",
  fgOnAccent: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.6)",
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
 * Light mode base tokens.
 * Used internally by ThemeProvider when mode="light".
 * Can also be used directly: createTheme({ ...lightThemeBase, accent: "#6366f1" })
 */
export const lightThemeBase: CharlieTheme = {
  // Backgrounds
  bg: "#ffffff",
  bg100: "#f9fafb",
  bg200: "#f3f4f6",
  bg300: "#e5e7eb",
  bg400: "#d1d5db",
  surface: "#f9fafb",
  surfaceElevated: "#ffffff",

  // Foreground / text
  fg: "#111827",
  fg200: "#374151",
  fg300: "#6b7280",
  fg400: "#9ca3af",
  textLoud: "#030712",
  textDefault: "#4b5563",
  textMuted: "#9ca3af",
  textFaint: "#d1d5db",

  // Accent (same hue, adjusted muted/dim for light bg)
  accent: "#ef4444",
  accentMuted: "#fef2f2",
  accentDim: "#dc2626",

  // Semantic colors (darker for contrast on white)
  red: "#dc2626",
  redMuted: "rgba(220, 38, 38, 0.08)",
  redDim: "#991b1b",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#ca8a04",
  orange: "#ea580c",
  purple: "#7c3aed",

  // New semantic tokens
  bgSubtle: "rgba(0, 0, 0, 0.04)",
  bgSubtleHover: "rgba(0, 0, 0, 0.06)",
  fgOnAccent: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.3)",

  // UI surface
  buttonBg: "#111827",
  buttonBgHover: "#030712",
  buttonFg: "#ffffff",
  controlBg: "rgba(0, 0, 0, 0.06)",
  separator: "rgba(0, 0, 0, 0.08)",
  border: "rgba(0, 0, 0, 0.08)",
  borderStrong: "rgba(0, 0, 0, 0.12)",
  borderHover: "rgba(0, 0, 0, 0.2)",

  // Shadows (no inset white highlights, softer black)
  shadowXs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowSoft: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04)",
  shadowCard: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 0 rgba(0, 0, 0, 0.02)",
  shadowCardHover: "0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 8px 20px 0 rgba(0, 0, 0, 0.06)",
  shadowElevated: "0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.06)",
  shadowFloat: "0 8px 40px 8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)",
  shadowButton: "0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)",
  shadowButtonHover: "0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04)",
  shadowInput: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.08)",
  shadowInputFocus: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 0 0 2px rgba(37, 99, 235, 0.2)",
};

/** Complete light theme preset (default theme structure + light colors) */
export const lightTheme: CharlieTheme = {
  ...defaultTheme,
  ...lightThemeBase,
};

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

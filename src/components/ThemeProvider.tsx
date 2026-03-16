"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * Charlie UI theme configuration.
 * Override any token to customize the look of all components.
 * All values map to --charlie-* CSS custom properties.
 */
export interface CharlieTheme {
  /** Primary accent color (default: #ff6363) */
  accent?: string;
  accentMuted?: string;
  accentDim?: string;

  /** Background colors */
  bg?: string;
  bg100?: string;
  bg200?: string;
  bg300?: string;
  bg400?: string;
  surface?: string;
  surfaceElevated?: string;

  /** Foreground / text colors */
  fg?: string;
  fg200?: string;
  fg300?: string;
  fg400?: string;
  textLoud?: string;
  textDefault?: string;
  textMuted?: string;
  textFaint?: string;

  /** Semantic colors */
  red?: string;
  redMuted?: string;
  redDim?: string;
  blue?: string;
  green?: string;
  yellow?: string;
  orange?: string;
  purple?: string;

  /** UI surface colors */
  buttonBg?: string;
  buttonBgHover?: string;
  buttonFg?: string;
  controlBg?: string;
  separator?: string;
  border?: string;
  borderStrong?: string;
  borderHover?: string;

  /** Border radii */
  radiusXs?: string;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusXl?: string;
  radius2xl?: string;
  radius3xl?: string;

  /** Typography */
  fontSans?: string;
  fontDisplay?: string;
  fontMono?: string;

  /** Animation */
  durationFast?: string;
  durationNormal?: string;
  durationModerate?: string;
  durationSlow?: string;
}

const ThemeContext = createContext<CharlieTheme>({});

/** Access the current Charlie UI theme */
export function useTheme(): CharlieTheme {
  return useContext(ThemeContext);
}

/** Map a CharlieTheme object to CSS custom property declarations */
function themeToCSS(theme: CharlieTheme): Record<string, string> {
  const map: Record<keyof CharlieTheme, string> = {
    accent: "--charlie-accent",
    accentMuted: "--charlie-accent-muted",
    accentDim: "--charlie-accent-dim",
    bg: "--charlie-bg",
    bg100: "--charlie-bg-100",
    bg200: "--charlie-bg-200",
    bg300: "--charlie-bg-300",
    bg400: "--charlie-bg-400",
    surface: "--charlie-surface",
    surfaceElevated: "--charlie-surface-elevated",
    fg: "--charlie-fg",
    fg200: "--charlie-fg-200",
    fg300: "--charlie-fg-300",
    fg400: "--charlie-fg-400",
    textLoud: "--charlie-text-loud",
    textDefault: "--charlie-text-default",
    textMuted: "--charlie-text-muted",
    textFaint: "--charlie-text-faint",
    red: "--charlie-red",
    redMuted: "--charlie-red-muted",
    redDim: "--charlie-red-dim",
    blue: "--charlie-blue",
    green: "--charlie-green",
    yellow: "--charlie-yellow",
    orange: "--charlie-orange",
    purple: "--charlie-purple",
    buttonBg: "--charlie-button-bg",
    buttonBgHover: "--charlie-button-bg-hover",
    buttonFg: "--charlie-button-fg",
    controlBg: "--charlie-control-bg",
    separator: "--charlie-separator",
    border: "--charlie-border",
    borderStrong: "--charlie-border-strong",
    borderHover: "--charlie-border-hover",
    radiusXs: "--charlie-radius-xs",
    radiusSm: "--charlie-radius-sm",
    radiusMd: "--charlie-radius-md",
    radiusLg: "--charlie-radius-lg",
    radiusXl: "--charlie-radius-xl",
    radius2xl: "--charlie-radius-2xl",
    radius3xl: "--charlie-radius-3xl",
    fontSans: "--charlie-font-sans",
    fontDisplay: "--charlie-font-display",
    fontMono: "--charlie-font-mono",
    durationFast: "--charlie-duration-fast",
    durationNormal: "--charlie-duration-normal",
    durationModerate: "--charlie-duration-moderate",
    durationSlow: "--charlie-duration-slow",
  };

  const styles: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(map)) {
    const value = theme[key as keyof CharlieTheme];
    if (value !== undefined) {
      styles[cssVar] = value;
    }
  }
  return styles;
}

export interface ThemeProviderProps {
  /** Theme overrides */
  theme?: CharlieTheme;
  /** Scoped to this provider's children only (uses a wrapper div) */
  children: ReactNode;
  /** Additional className for the wrapper div */
  className?: string;
}

/**
 * Provides a Charlie UI theme to all descendant components.
 *
 * Usage:
 * ```tsx
 * <ThemeProvider theme={{ accent: "#6366f1" }}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * You can also nest ThemeProviders for scoped theming:
 * ```tsx
 * <ThemeProvider theme={{ accent: "#ff6363" }}>
 *   <Sidebar />
 *   <ThemeProvider theme={{ accent: "#59d499" }}>
 *     <SpecialSection />
 *   </ThemeProvider>
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ theme = {}, children, className }: ThemeProviderProps) {
  const parentTheme = useTheme();
  const mergedTheme = useMemo(() => ({ ...parentTheme, ...theme }), [parentTheme, theme]);
  const cssVars = useMemo(() => themeToCSS(mergedTheme), [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <div className={cn("contents", className)} style={cssVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

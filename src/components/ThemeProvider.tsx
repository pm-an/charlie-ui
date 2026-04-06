"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { lightThemeBase } from "../themes/presets";

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

  /** Typography scale */
  textXs?: string;
  textSm?: string;
  textBase?: string;
  textLg?: string;
  textXl?: string;
  text2xl?: string;
  text3xl?: string;

  /** Animation */
  durationFast?: string;
  durationNormal?: string;
  durationModerate?: string;
  durationSlow?: string;

  /** Additional semantic colors */
  bgSubtle?: string;
  bgSubtleHover?: string;
  fgOnAccent?: string;
  overlay?: string;

  /** Shadow overrides */
  shadowXs?: string;
  shadowSoft?: string;
  shadowCard?: string;
  shadowCardHover?: string;
  shadowElevated?: string;
  shadowFloat?: string;
  shadowButton?: string;
  shadowButtonHover?: string;
  shadowInput?: string;
  shadowInputFocus?: string;
}

export type ColorMode = "dark" | "light" | "system";
export type ResolvedColorMode = "dark" | "light";

const ThemeContext = createContext<CharlieTheme>({});
const ColorModeContext = createContext<ResolvedColorMode>("dark");

/** Access the current Charlie UI theme */
export function useTheme(): CharlieTheme {
  return useContext(ThemeContext);
}

/** Returns the resolved color mode ("dark" or "light") */
export function useColorMode(): ResolvedColorMode {
  return useContext(ColorModeContext);
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function useSystemColorScheme(): ResolvedColorMode {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(COLOR_SCHEME_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(COLOR_SCHEME_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDark ? "dark" : "light";
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
    textXs: "--charlie-text-xs",
    textSm: "--charlie-text-sm",
    textBase: "--charlie-text-base",
    textLg: "--charlie-text-lg",
    textXl: "--charlie-text-xl",
    text2xl: "--charlie-text-2xl",
    text3xl: "--charlie-text-3xl",
    durationFast: "--charlie-duration-fast",
    durationNormal: "--charlie-duration-normal",
    durationModerate: "--charlie-duration-moderate",
    durationSlow: "--charlie-duration-slow",
    bgSubtle: "--charlie-bg-subtle",
    bgSubtleHover: "--charlie-bg-subtle-hover",
    fgOnAccent: "--charlie-fg-on-accent",
    overlay: "--charlie-overlay",
    shadowXs: "--charlie-shadow-xs",
    shadowSoft: "--charlie-shadow-soft",
    shadowCard: "--charlie-shadow-card",
    shadowCardHover: "--charlie-shadow-card-hover",
    shadowElevated: "--charlie-shadow-elevated",
    shadowFloat: "--charlie-shadow-float",
    shadowButton: "--charlie-shadow-button",
    shadowButtonHover: "--charlie-shadow-button-hover",
    shadowInput: "--charlie-shadow-input",
    shadowInputFocus: "--charlie-shadow-input-focus",
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
  /** Color mode: "dark" (default), "light", or "system" (auto-detect) */
  mode?: ColorMode;
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
 * Light mode:
 * ```tsx
 * <ThemeProvider mode="light">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * You can also nest ThemeProviders for scoped theming:
 * ```tsx
 * <ThemeProvider theme={{ accent: "#ff6363" }}>
 *   <Sidebar />
 *   <ThemeProvider mode="light" theme={{ accent: "#59d499" }}>
 *     <SpecialSection />
 *   </ThemeProvider>
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ theme = {}, mode = "dark", children, className }: ThemeProviderProps) {
  const parentTheme = useTheme();
  const systemMode = useSystemColorScheme();

  const resolvedMode: ResolvedColorMode = useMemo(() => {
    if (mode === "system") return systemMode;
    return mode;
  }, [mode, systemMode]);

  const mergedTheme = useMemo(() => {
    if (resolvedMode === "light") {
      return { ...parentTheme, ...lightThemeBase, ...theme };
    }
    return { ...parentTheme, ...theme };
  }, [parentTheme, theme, resolvedMode]);

  const cssVars = useMemo(() => themeToCSS(mergedTheme), [mergedTheme]);

  return (
    <ColorModeContext.Provider value={resolvedMode}>
      <ThemeContext.Provider value={mergedTheme}>
        <div
          className={cn("contents", className)}
          style={cssVars as React.CSSProperties}
          data-charlie-mode={resolvedMode}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    </ColorModeContext.Provider>
  );
}

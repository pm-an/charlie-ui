"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * Charlie UI theme configuration.
 * Override any token to customize the look of all components.
 * All values map to --color-* CSS custom properties (Tailwind @theme tokens).
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

/**
 * Maps CharlieTheme keys to their corresponding CSS custom property names.
 * Only emits --color-* vars for tokens the consumer explicitly overrides.
 * Dark/light base tokens are handled by CSS selectors in theme.css, not inline styles.
 */
function themeToCSS(theme: CharlieTheme): Record<string, string> {
  const map: Record<keyof CharlieTheme, string> = {
    accent:           "--color-accent",
    accentMuted:      "--color-accent-muted",
    accentDim:        "--color-accent-dim",
    bg:               "--color-bg",
    bg100:            "--color-bg-100",
    bg200:            "--color-bg-200",
    bg300:            "--color-bg-300",
    bg400:            "--color-bg-400",
    surface:          "--color-surface",
    surfaceElevated:  "--color-surface-elevated",
    fg:               "--color-fg",
    fg200:            "--color-fg-200",
    fg300:            "--color-fg-300",
    fg400:            "--color-fg-400",
    textLoud:         "--color-text-loud",
    textDefault:      "--color-text-default",
    textMuted:        "--color-text-muted",
    textFaint:        "--color-text-faint",
    red:              "--color-red",
    redMuted:         "--color-red-muted",
    redDim:           "--color-red-dim",
    blue:             "--color-blue",
    green:            "--color-green",
    yellow:           "--color-yellow",
    orange:           "--color-orange",
    purple:           "--color-purple",
    buttonBg:         "--color-button-bg",
    buttonBgHover:    "--color-button-bg-hover",
    buttonFg:         "--color-button-fg",
    controlBg:        "--color-control-bg",
    separator:        "--color-separator",
    border:           "--color-border",
    borderStrong:     "--color-border-strong",
    borderHover:      "--color-border-hover",
    radiusXs:         "--radius-xs",
    radiusSm:         "--radius-sm",
    radiusMd:         "--radius-md",
    radiusLg:         "--radius-lg",
    radiusXl:         "--radius-xl",
    radius2xl:        "--radius-2xl",
    radius3xl:        "--radius-3xl",
    fontSans:         "--font-sans",
    fontDisplay:      "--font-display",
    fontMono:         "--font-mono",
    textXs:           "--text-xs",
    textSm:           "--text-sm",
    textBase:         "--text-base",
    textLg:           "--text-lg",
    textXl:           "--text-xl",
    text2xl:          "--text-2xl",
    text3xl:          "--text-3xl",
    durationFast:     "--charlie-duration-fast",
    durationNormal:   "--charlie-duration-normal",
    durationModerate: "--charlie-duration-moderate",
    durationSlow:     "--charlie-duration-slow",
    bgSubtle:         "--color-bg-subtle",
    bgSubtleHover:    "--color-bg-subtle-hover",
    fgOnAccent:       "--color-fg-on-accent",
    overlay:          "--color-overlay",
    shadowXs:         "--shadow-xs",
    shadowSoft:       "--shadow-soft",
    shadowCard:       "--shadow-card",
    shadowCardHover:  "--shadow-card-hover",
    shadowElevated:   "--shadow-elevated",
    shadowFloat:      "--shadow-float",
    shadowButton:     "--shadow-button",
    shadowButtonHover:"--shadow-button-hover",
    shadowInput:      "--shadow-input",
    shadowInputFocus: "--shadow-input-focus",
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
  /** Custom theme overrides (accent, brand colors, fonts). Dark/light base tokens are CSS-only. */
  theme?: CharlieTheme;
  /** Color mode: "dark" (default), "light", or "system" (auto-detect) */
  mode?: ColorMode;
  children: ReactNode;
  className?: string;
}

/**
 * Provides a Charlie UI theme to all descendant components.
 *
 * Dark/light mode switching is handled entirely by CSS via `[data-charlie-mode]`
 * selectors in theme.css. The theme prop is for custom overrides only (accent, brand).
 *
 * ```tsx
 * <ThemeProvider mode="dark" theme={{ accent: "#6366f1" }}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * Nested providers work for scoped theming:
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

  // No lightThemeBase merge — CSS handles dark/light base tokens
  const mergedTheme = useMemo(() => {
    return { ...parentTheme, ...theme };
  }, [parentTheme, theme]);

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

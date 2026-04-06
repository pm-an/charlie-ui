import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";
import { ThemeProvider } from "../src/components/ThemeProvider";
import type { CharlieTheme, ColorMode } from "../src/components/ThemeProvider";
import {
  defaultTheme,
  indigoTheme,
  oceanTheme,
  emeraldTheme,
  amberTheme,
  roseTheme,
  violetTheme,
  lightThemeBase,
  indigoLightTheme,
  oceanLightTheme,
  emeraldLightTheme,
  amberLightTheme,
  roseLightTheme,
  violetLightTheme,
} from "../src/themes/presets";
import "../src/styles/globals.css";

/* ── Theme map (keyed by toolbar value) ── */
const themeMap: Record<string, CharlieTheme> = {
  default: defaultTheme,
  indigo: indigoTheme,
  ocean: oceanTheme,
  emerald: emeraldTheme,
  amber: amberTheme,
  rose: roseTheme,
  violet: violetTheme,
};

/** Light-mode accent overrides per theme preset */
const lightThemeMap: Record<string, CharlieTheme> = {
  default: {},
  indigo: indigoLightTheme,
  ocean: oceanLightTheme,
  emerald: emeraldLightTheme,
  amber: amberLightTheme,
  rose: roseLightTheme,
  violet: violetLightTheme,
};

/**
 * Map a CharlieTheme to --charlie-* CSS custom property entries.
 * Mirrors the mapping in ThemeProvider's themeToCSS — keep in sync!
 */
const charlieVarMap: Record<keyof CharlieTheme, string> = {
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

const charlieDocsTheme = create({
  base: "dark",
  colorPrimary: "#ef4444",
  colorSecondary: "#ef4444",
  appBg: "#07080a",
  appContentBg: "#0c0d0f",
  appBorderColor: "rgba(255,255,255,0.06)",
  textColor: "#f4f4f5",
  textMutedColor: "#6a6b6c",
});

/**
 * Decorator that applies --charlie-* CSS vars on :root so they are picked up
 * by the @theme token declarations (e.g. --color-accent: var(--charlie-accent, …)).
 *
 * Also sets `data-charlie-mode` on the root element for CSS utility overrides
 * (glass, glow, shadow, gradient utilities in globals.css).
 */
function ThemeDecorator({
  theme,
  mode,
  children,
}: {
  theme: CharlieTheme;
  mode: "dark" | "light";
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const applied: string[] = [];

    for (const [key, cssVar] of Object.entries(charlieVarMap)) {
      const value = theme[key as keyof CharlieTheme];
      if (value !== undefined) {
        root.style.setProperty(cssVar, value);
        applied.push(cssVar);
      } else {
        root.style.removeProperty(cssVar);
      }
    }

    // Set data-charlie-mode on the root element so CSS utility overrides
    // in globals.css (e.g. [data-charlie-mode="light"] .glass) take effect.
    root.setAttribute("data-charlie-mode", mode);

    return () => {
      applied.forEach((v) => root.style.removeProperty(v));
      root.removeAttribute("data-charlie-mode");
    };
  }, [theme, mode]);

  return <>{children}</>;
}

/** Resolve the effective theme by merging accent preset + light base + light accent overrides */
function resolveTheme(themeKey: string, mode: "dark" | "light"): CharlieTheme {
  const accentTheme = themeMap[themeKey] || defaultTheme;
  if (mode === "light") {
    const lightAccent = lightThemeMap[themeKey] || {};
    return { ...accentTheme, ...lightThemeBase, ...lightAccent };
  }
  return accentTheme;
}

const preview: Preview = {
  globalTypes: {
    charlieTheme: {
      description: "Charlie UI theme preset",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default (Red)", right: "🔴" },
          { value: "indigo", title: "Indigo", right: "🟣" },
          { value: "ocean", title: "Ocean", right: "🔵" },
          { value: "emerald", title: "Emerald", right: "🟢" },
          { value: "amber", title: "Amber", right: "🟡" },
          { value: "rose", title: "Rose", right: "🌹" },
          { value: "violet", title: "Violet", right: "💜" },
        ],
        dynamicTitle: true,
      },
    },
    charlieMode: {
      description: "Charlie UI color mode",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "light", title: "Light", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    charlieTheme: "default",
    charlieMode: "dark",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: "centered",
    docs: {
      theme: charlieDocsTheme,
    },
    a11y: {
      test: "error",
    },
    chromatic: {
      modes: {
        dark: { globals: { charlieMode: "dark" } },
        light: { globals: { charlieMode: "light" } },
      },
    },
    options: {
      storySort: {
        order: [
          "Primitives",
          "Forms",
          "Navigation",
          "Layout",
          "Cards",
          "Data Display",
          "Charts",
          "Overlays",
          "Feedback",
          "Animation",
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeKey = context.globals.charlieTheme || "default";
      const mode = (context.globals.charlieMode || "dark") as "dark" | "light";
      const theme = resolveTheme(themeKey, mode);
      return (
        <ThemeDecorator theme={theme} mode={mode}>
          <ThemeProvider theme={theme} mode={mode as ColorMode}>
            <div style={{ background: theme.bg || "#07080a" }}>
              <Story />
            </div>
          </ThemeProvider>
        </ThemeDecorator>
      );
    },
  ],
};

export default preview;

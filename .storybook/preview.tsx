import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";
import { ThemeProvider } from "../src/components/ThemeProvider";
import {
  defaultTheme,
  indigoTheme,
  oceanTheme,
  emeraldTheme,
  amberTheme,
  roseTheme,
  violetTheme,
} from "../src/themes/presets";
import type { CharlieTheme } from "../src/components/ThemeProvider";
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

/**
 * Map a CharlieTheme to --charlie-* CSS custom property entries.
 * Mirrors the mapping in ThemeProvider's themeToCSS.
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

const charlieDocsTheme = create({
  base: "dark",
  colorPrimary: "#ff6363",
  colorSecondary: "#ff6363",
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
 * Setting them on :root (document.documentElement) rather than a wrapper div
 * is required because the @theme block resolves var() on :root at computed-value
 * time — a child-element override of --charlie-accent does not retroactively
 * change the already-inherited --color-accent value.
 */
function ThemeDecorator({
  theme,
  children,
}: {
  theme: CharlieTheme;
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
        // Remove vars not in this theme so fallbacks kick in
        root.style.removeProperty(cssVar);
      }
    }

    return () => {
      applied.forEach((v) => root.style.removeProperty(v));
    };
  }, [theme]);

  return <>{children}</>;
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
  },
  initialGlobals: {
    charlieTheme: "default",
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
      const theme = themeMap[themeKey] || defaultTheme;
      return (
        <ThemeDecorator theme={theme}>
          <ThemeProvider theme={theme}>
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

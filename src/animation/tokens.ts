/**
 * Charlie UI — Animation Design Tokens
 *
 * Duration, easing, spring, and distance constants used by
 * the animation presets and components. Values mirror the
 * --charlie-duration-* / --charlie-ease-* CSS custom properties
 * so the JS runtime and CSS layers stay in sync.
 */

/* ─── Durations (seconds) ──────────────────── */

export const duration = {
  fast: 0.26,
  normal: 0.39,
  moderate: 0.65,
  slow: 1.04,
} as const;

export type Duration = keyof typeof duration;

/* ─── Easings (cubic-bezier arrays) ────────── */

export const easing = {
  default: [0.2, 0, 0, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  inOut: [0.4, 0, 0.2, 1],
  spring: [0.16, 1, 0.3, 1],
  bounce: [0.34, 1.56, 0.64, 1],
} as const;

export type Easing = keyof typeof easing;

/* ─── Spring configs (for framer-motion) ───── */

export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 24 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 10 },
} as const;

export type Spring = keyof typeof spring;

/* ─── Distances (pixels) ───────────────────── */

export const distance = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export type Distance = keyof typeof distance;

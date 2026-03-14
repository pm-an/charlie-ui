/**
 * Charlie UI — Animation Presets
 *
 * Each preset defines `initial`, `animate`, and `exit` states
 * consumed by framer-motion. The `transition` field provides
 * sensible defaults that can be overridden per-use.
 */

import { duration, easing, distance } from "./tokens";
import type { TargetAndTransition, Target } from "framer-motion";

/* ─── Preset shape ─────────────────────────── */

export interface AnimationPreset {
  initial: Target;
  animate: TargetAndTransition;
  exit: Target;
  transition: {
    duration: number;
    ease: readonly number[];
  };
}

/* ─── Preset definitions ───────────────────── */

const presets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal, ease: easing.out },
  },

  fadeUp: {
    initial: { opacity: 0, y: distance.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance.sm },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  fadeDown: {
    initial: { opacity: 0, y: -distance.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance.sm },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  fadeLeft: {
    initial: { opacity: 0, x: -distance.sm },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -distance.sm },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  fadeRight: {
    initial: { opacity: 0, x: distance.sm },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: distance.sm },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  slideUp: {
    initial: { y: distance.lg },
    animate: { y: 0 },
    exit: { y: distance.lg },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  slideDown: {
    initial: { y: -distance.lg },
    animate: { y: 0 },
    exit: { y: -distance.lg },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  slideLeft: {
    initial: { x: -distance.lg },
    animate: { x: 0 },
    exit: { x: -distance.lg },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  slideRight: {
    initial: { x: distance.lg },
    animate: { x: 0 },
    exit: { x: distance.lg },
    transition: { duration: duration.moderate, ease: easing.spring },
  },

  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: duration.normal, ease: easing.out },
  },

  scaleUp: {
    initial: { opacity: 0, scale: 0.96, y: -distance.sm },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -distance.sm },
    transition: { duration: duration.normal, ease: easing.out },
  },

  collapse: {
    initial: { height: 0, opacity: 0, overflow: "hidden" as const },
    animate: { height: "auto", opacity: 1, overflow: "hidden" as const },
    exit: { height: 0, opacity: 0, overflow: "hidden" as const },
    transition: { duration: duration.moderate, ease: easing.default },
  },

  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: duration.moderate, ease: easing.bounce },
  },
} as const satisfies Record<string, AnimationPreset>;

export type PresetName = keyof typeof presets;

export { presets };

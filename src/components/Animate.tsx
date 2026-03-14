"use client";

import {
  forwardRef,
  type ReactNode,
  type ElementType,
} from "react";
import {
  motion,
  AnimatePresence,
  type Target,
  type TargetAndTransition,
} from "framer-motion";
import { presets, type PresetName } from "../animation/presets";
import type { Duration, Easing } from "../animation/tokens";
import { useAnimationConfig } from "../animation/AnimationProvider";
import { useReducedMotion } from "../animation/useReducedMotion";
import { resolveDuration, resolveEasing } from "../animation/utils";

/* ─── Static "no motion" values ────────────── */

const STATIC: Target = {};

/* ─── Props ────────────────────────────────── */

export interface AnimateProps {
  /** Named animation preset */
  preset?: PresetName;
  /** Enter/exit toggle — wraps AnimatePresence internally */
  show?: boolean;
  /** Duration token or seconds */
  duration?: Duration | number;
  /** Easing token or cubic-bezier array */
  easing?: Easing | number[];
  /** Delay in seconds */
  delay?: number;
  /** Animate when entering the viewport */
  viewport?: boolean | { once?: boolean; margin?: string; amount?: number };
  /** Rendered HTML element (default: "div") */
  as?: ElementType;
  /** Custom initial state (overrides preset) */
  initial?: Target;
  /** Custom animate state (overrides preset) */
  animate?: TargetAndTransition;
  /** Custom exit state (overrides preset) */
  exit?: Target;

  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Core animation primitive for Charlie UI.
 *
 * Wraps Framer Motion with preset support, AnimatePresence,
 * viewport triggering, and reduced-motion awareness.
 *
 * When no `AnimationProvider` ancestor is present, falls back to
 * checking `prefers-reduced-motion` directly via `useReducedMotion()`.
 *
 * ```tsx
 * <Animate preset="fadeUp" show={visible}>
 *   <Card>Hello</Card>
 * </Animate>
 * ```
 */
export const Animate = forwardRef<HTMLElement, AnimateProps>(function Animate(
  {
    preset,
    show,
    duration: durationProp,
    easing: easingProp,
    delay,
    viewport,
    as = "div",
    initial: initialOverride,
    animate: animateOverride,
    exit: exitOverride,
    children,
    className,
    style,
  },
  ref
) {
  const ctx = useAnimationConfig();
  const osReducedMotion = useReducedMotion();

  // If a provider is present, ctx.enabled already accounts for reduced motion.
  // If no provider (default context), fall back to the OS preference.
  const disabled = !ctx.enabled || (ctx.prefersReducedMotion === false && osReducedMotion);

  /* Resolve preset */
  const p = preset ? presets[preset] : undefined;

  /* Merge: override > prop > context > preset > defaults */
  const dur = resolveDuration(durationProp) ?? resolveDuration(ctx.duration) ?? p?.transition.duration;
  const eas = resolveEasing(easingProp) ?? resolveEasing(ctx.easing) ?? (p ? [p.transition.ease[0], p.transition.ease[1], p.transition.ease[2], p.transition.ease[3]] as [number, number, number, number] : undefined);

  const transition = {
    ...(dur !== undefined && { duration: dur }),
    ...(eas !== undefined && { ease: eas }),
    ...(delay !== undefined && { delay }),
  };

  const initial = disabled ? STATIC : (initialOverride ?? p?.initial ?? STATIC);
  const animate = disabled ? STATIC : (animateOverride ?? p?.animate ?? STATIC);
  const exit = disabled ? STATIC : (exitOverride ?? p?.exit ?? initial);

  /* Viewport config */
  const vpConfig =
    viewport === true
      ? { once: true }
      : viewport === false || viewport === undefined
        ? undefined
        : viewport;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tag = as as string;
  const MotionTag: any = (motion as any)[tag] ?? motion.create(tag);

  const motionEl = (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      initial={initial}
      animate={vpConfig ? undefined : animate}
      exit={exit}
      transition={disabled ? { duration: 0 } : transition}
      {...(vpConfig ? { whileInView: animate, viewport: vpConfig } : {})}
    >
      {children}
    </MotionTag>
  );

  /* If `show` is provided, wrap in AnimatePresence for enter/exit */
  if (show !== undefined) {
    return (
      <AnimatePresence mode="wait">
        {show && motionEl}
      </AnimatePresence>
    );
  }

  return motionEl;
});

Animate.displayName = "Animate";

/* ═══════════════════════════════════════════════
   Named Wrappers
   ═══════════════════════════════════════════════ */

type WrapperProps = Omit<AnimateProps, "preset">;

/* ─── Fade ─────────────────────────────────── */

export type FadeProps = WrapperProps;

export const Fade = forwardRef<HTMLElement, FadeProps>(function Fade(props, ref) {
  return <Animate ref={ref} preset="fade" {...props} />;
});
Fade.displayName = "Fade";

/* ─── Slide ────────────────────────────────── */

const slidePresetMap = {
  up: "slideUp",
  down: "slideDown",
  left: "slideLeft",
  right: "slideRight",
} as const;

export interface SlideProps extends WrapperProps {
  direction?: "up" | "down" | "left" | "right";
}

export const Slide = forwardRef<HTMLElement, SlideProps>(function Slide(
  { direction = "up", ...props },
  ref
) {
  return <Animate ref={ref} preset={slidePresetMap[direction]} {...props} />;
});
Slide.displayName = "Slide";

/* ─── Scale ────────────────────────────────── */

export type ScaleProps = WrapperProps;

export const Scale = forwardRef<HTMLElement, ScaleProps>(function Scale(props, ref) {
  return <Animate ref={ref} preset="scale" {...props} />;
});
Scale.displayName = "Scale";

/* ─── ScaleFade ────────────────────────────── */

export type ScaleFadeProps = WrapperProps;

export const ScaleFade = forwardRef<HTMLElement, ScaleFadeProps>(function ScaleFade(props, ref) {
  return <Animate ref={ref} preset="scaleUp" {...props} />;
});
ScaleFade.displayName = "ScaleFade";

/* ─── Collapse ─────────────────────────────── */

export type CollapseProps = WrapperProps;

export const Collapse = forwardRef<HTMLElement, CollapseProps>(function Collapse(props, ref) {
  return <Animate ref={ref} preset="collapse" {...props} />;
});
Collapse.displayName = "Collapse";

/* ─── Pop ──────────────────────────────────── */

export type PopProps = WrapperProps;

export const Pop = forwardRef<HTMLElement, PopProps>(function Pop(props, ref) {
  return <Animate ref={ref} preset="pop" {...props} />;
});
Pop.displayName = "Pop";

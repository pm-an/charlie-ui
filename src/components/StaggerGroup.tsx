"use client";

import {
  forwardRef,
  Children,
  useMemo,
  type ReactNode,
  type ElementType,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { presets, type PresetName } from "../animation/presets";
import type { Duration, Easing } from "../animation/tokens";
import { useAnimationConfig } from "../animation/AnimationProvider";
import { useReducedMotion } from "../animation/useReducedMotion";
import { resolveDuration, resolveEasing } from "../animation/utils";

/* ─── Props ────────────────────────────────── */

export interface StaggerGroupProps {
  /** Animation preset applied to each child */
  preset?: PresetName;
  /** Delay between each child (seconds, default: 0.05) */
  stagger?: number;
  /** Duration token or seconds */
  duration?: Duration | number;
  /** Easing token or cubic-bezier array */
  easing?: Easing | number[];
  /** Enter/exit toggle — wraps AnimatePresence internally */
  show?: boolean;
  /** Animate children as they enter the viewport */
  viewport?: boolean | { once?: boolean; margin?: string; amount?: number };
  /** Rendered HTML element (default: "div") */
  as?: ElementType;

  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Orchestrates staggered animations across children.
 *
 * When no `AnimationProvider` ancestor is present, falls back to
 * checking `prefers-reduced-motion` directly via `useReducedMotion()`.
 *
 * ```tsx
 * <StaggerGroup preset="fadeUp" stagger={0.1} viewport>
 *   <Card>One</Card>
 *   <Card>Two</Card>
 *   <Card>Three</Card>
 * </StaggerGroup>
 * ```
 */
export const StaggerGroup = forwardRef<HTMLElement, StaggerGroupProps>(
  function StaggerGroup(
    {
      preset = "fadeUp",
      stagger = 0.05,
      duration: durationProp,
      easing: easingProp,
      show,
      viewport,
      as = "div",
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

    const p = presets[preset];

    const dur = resolveDuration(durationProp) ?? resolveDuration(ctx.duration) ?? p.transition.duration;
    const eas = resolveEasing(easingProp) ?? resolveEasing(ctx.easing) ?? [p.transition.ease[0], p.transition.ease[1], p.transition.ease[2], p.transition.ease[3]] as [number, number, number, number];

    /* Viewport config */
    const vpConfig =
      viewport === true
        ? { once: true }
        : viewport === false || viewport === undefined
          ? undefined
          : viewport;

    /* Container variant for stagger orchestration */
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: disabled ? 0 : stagger,
        },
      },
    };

    /* Child variant from preset */
    const childVariants = disabled
      ? { hidden: {}, visible: {} }
      : {
          hidden: p.initial,
          visible: {
            ...p.animate,
            transition: {
              duration: dur,
              ease: eas,
            },
          },
        };

    // Memoize the motion component to avoid recreating it on every render
    const MotionTag = useMemo(() => {
      const tag = as as string;
      return ((motion as unknown as Record<string, unknown>)[tag] ?? motion.create(tag)) as React.ComponentType<Record<string, unknown>>;
    }, [as]);

    const content = (
      <MotionTag
        ref={ref}
        className={className}
        style={style}
        variants={containerVariants}
        initial="hidden"
        animate={vpConfig ? undefined : "visible"}
        exit="hidden"
        {...(vpConfig ? { whileInView: "visible", viewport: vpConfig } : {})}
      >
        {Children.map(children, (child) => (
          <motion.div variants={childVariants}>{child}</motion.div>
        ))}
      </MotionTag>
    );

    if (show !== undefined) {
      return (
        <AnimatePresence mode="wait">
          {show && content}
        </AnimatePresence>
      );
    }

    return content;
  }
);

StaggerGroup.displayName = "StaggerGroup";

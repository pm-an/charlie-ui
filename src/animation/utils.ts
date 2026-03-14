/**
 * Charlie UI — Animation Utility Helpers
 *
 * Shared helpers for resolving animation token names
 * (duration, easing) to their concrete runtime values.
 */

import type { Easing as MotionEasing } from "framer-motion";
import { duration as durationTokens, easing as easingTokens } from "./tokens";
import type { Duration, Easing } from "./tokens";

/** Resolve a duration token name or raw number to seconds */
export function resolveDuration(
  d: Duration | number | undefined
): number | undefined {
  if (d === undefined) return undefined;
  if (typeof d === "number") return d;
  return durationTokens[d];
}

/** Resolve an easing token name or raw array to a framer-motion Easing value */
export function resolveEasing(
  e: Easing | number[] | undefined
): MotionEasing | undefined {
  if (e === undefined) return undefined;
  if (Array.isArray(e)) return e as [number, number, number, number];
  const vals = easingTokens[e];
  return [vals[0], vals[1], vals[2], vals[3]] as [
    number,
    number,
    number,
    number,
  ];
}

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";
import type { Duration, Easing } from "./tokens";

/* ─── Config shape ─────────────────────────── */

export interface AnimationConfig {
  /** Global kill switch — set `false` to disable all animation primitives (default: true) */
  enabled?: boolean;
  /** Honour the OS `prefers-reduced-motion` setting (default: true) */
  respectReducedMotion?: boolean;
  /** Default duration override (token name or seconds) */
  duration?: Duration | number;
  /** Default easing override */
  easing?: Easing;
}

/* ─── Internal resolved context ────────────── */

export interface AnimationContextValue {
  /** Whether animations should run right now */
  enabled: boolean;
  /** Raw OS reduced-motion preference */
  prefersReducedMotion: boolean;
  /** Duration override from the provider (undefined = use preset default) */
  duration?: Duration | number;
  /** Easing override from the provider (undefined = use preset default) */
  easing?: Easing;
}

const AnimationContext = createContext<AnimationContextValue>({
  enabled: true,
  prefersReducedMotion: false,
});

/** Access the current animation context */
export function useAnimationConfig(): AnimationContextValue {
  return useContext(AnimationContext);
}

/* ─── Provider ─────────────────────────────── */

export interface AnimationProviderProps {
  config?: AnimationConfig;
  children: ReactNode;
}

/**
 * Global animation configuration provider.
 *
 * ```tsx
 * // Disable all animations (e.g. in tests)
 * <AnimationProvider config={{ enabled: false }}>
 *   <App />
 * </AnimationProvider>
 * ```
 */
export function AnimationProvider({ config = {}, children }: AnimationProviderProps) {
  const {
    enabled: enabledProp = true,
    respectReducedMotion = true,
    duration,
    easing,
  } = config;

  const prefersReducedMotion = useReducedMotion();

  const value = useMemo<AnimationContextValue>(() => {
    const enabled =
      enabledProp && !(respectReducedMotion && prefersReducedMotion);

    return { enabled, prefersReducedMotion, duration, easing };
  }, [enabledProp, respectReducedMotion, prefersReducedMotion, duration, easing]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

// Tokens
export {
  duration,
  easing,
  spring,
  distance,
  type Duration,
  type Easing,
  type Spring,
  type Distance,
} from "./tokens";

// Presets
export { presets, type PresetName, type AnimationPreset } from "./presets";

// Hook
export { useReducedMotion } from "./useReducedMotion";

// Provider
export {
  AnimationProvider,
  useAnimationConfig,
  type AnimationConfig,
  type AnimationContextValue,
  type AnimationProviderProps,
} from "./AnimationProvider";

// Utils
export { resolveDuration, resolveEasing } from "./utils";

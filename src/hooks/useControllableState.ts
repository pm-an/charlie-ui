import { useState, useCallback, useRef } from "react";

/**
 * Generic hook for supporting both controlled and uncontrolled component patterns.
 * When `controlledValue` is defined, the component is controlled.
 * When `controlledValue` is undefined, internal state is used with `defaultValue` as the initial value.
 *
 * Supports two signatures:
 * 1. `useControllableState<T>(controlled, defaultValue: T, onChange?)` — value is always `T`
 * 2. `useControllableState<T>(controlled, defaultValue: T | undefined, onChange?)` — value may be `T | undefined`
 */
export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T | ((prev: T) => T)) => void];

export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T | undefined) => void
): [T | undefined, (next: T | undefined | ((prev: T | undefined) => T | undefined)) => void];

export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  onChange?: (value: T | undefined) => void
): [T | undefined, (next: (T | undefined) | ((prev: T | undefined) => T | undefined)) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internal;

  // Keep a ref to onChange to avoid re-creating the setter
  const onChangeRef = useRef(onChange);
  // eslint-disable-next-line react-hooks/refs -- intentional: keeping ref in sync with latest onChange callback
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: (T | undefined) | ((prev: T | undefined) => T | undefined)) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T | undefined)(isControlled ? controlledValue : internal)
          : next;

      if (!isControlled) {
        setInternal(nextValue);
      }
      onChangeRef.current?.(nextValue);
    },
    [isControlled, controlledValue, internal]
  );

  return [value, setValue];
}

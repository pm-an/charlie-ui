"use client";

import { useEffect, useRef, useCallback, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container element.
 * Tab and Shift+Tab cycle through focusable children without leaving the container.
 *
 * @param containerRef - Ref to the container element
 * @param active - Whether the trap is active (default: true)
 * @param autoFocus - Whether to focus the first focusable element on activation (default: true)
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active = true,
  autoFocus = true
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [containerRef]
  );

  useEffect(() => {
    if (!active) return;

    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus first focusable element
    if (autoFocus) {
      const timer = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          // Fall back to focusing the container itself
          container.focus();
        }
      });
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        cancelAnimationFrame(timer);
      };
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, autoFocus, handleKeyDown, containerRef]);
}

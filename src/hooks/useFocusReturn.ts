"use client";

import { useEffect, useRef } from "react";

/**
 * Saves the currently focused element when `active` becomes true
 * and restores focus to it when `active` becomes false.
 *
 * @param active - Whether the overlay/dialog is open
 */
export function useFocusReturn(active: boolean) {
  const previousElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      previousElement.current = document.activeElement as HTMLElement | null;
    } else if (previousElement.current) {
      // Restore focus when deactivating
      const el = previousElement.current;
      // Use rAF to ensure the element is still in the DOM after unmount
      requestAnimationFrame(() => {
        if (el && typeof el.focus === "function" && document.contains(el)) {
          el.focus();
        }
      });
      previousElement.current = null;
    }
  }, [active]);
}

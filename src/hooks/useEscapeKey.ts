"use client";

import { useEffect, useCallback } from "react";

/**
 * Calls `handler` when the Escape key is pressed.
 *
 * @param handler - Function to call on Escape keydown
 * @param active - Whether the listener is active (default: true)
 */
export function useEscapeKey(handler: () => void, active = true) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handler();
      }
    },
    [handler]
  );

  useEffect(() => {
    if (!active) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, onKeyDown]);
}

"use client";

import { useEffect } from "react";

/**
 * Prevents body scrolling when `active` is true.
 * Restores the previous overflow value when deactivated or on unmount.
 *
 * @param active - Whether to lock scrolling
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

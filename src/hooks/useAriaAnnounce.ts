"use client";

import { useCallback, useRef, useEffect } from "react";

type Politeness = "polite" | "assertive";

/**
 * Provides a function to make programmatic screen reader announcements
 * via an injected ARIA live region.
 *
 * @param politeness - ARIA live politeness level (default: "polite")
 * @returns `announce` function that sets the live region text
 */
export function useAriaAnnounce(politeness: Politeness = "polite") {
  const regionRef = useRef<HTMLDivElement | null>(null);

  // Create or find the live region on mount
  useEffect(() => {
    const id = `charlie-aria-live-${politeness}`;
    let region = document.getElementById(id) as HTMLDivElement | null;

    if (!region) {
      region = document.createElement("div");
      region.id = id;
      region.setAttribute("aria-live", politeness);
      region.setAttribute("aria-atomic", "true");
      region.setAttribute("role", "status");
      Object.assign(region.style, {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: "0",
      });
      document.body.appendChild(region);
    }

    regionRef.current = region;

    // Don't remove on cleanup — shared across instances
  }, [politeness]);

  const announce = useCallback((message: string) => {
    const region = regionRef.current;
    if (!region) return;

    // Clear then set to ensure screen readers detect the change
    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }, []);

  return announce;
}

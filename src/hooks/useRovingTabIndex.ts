"use client";

import { useCallback, type RefObject, type KeyboardEvent } from "react";

export type RovingDirection = "horizontal" | "vertical" | "both";

export type UseRovingTabIndexOptions = {
  /** Direction for arrow key navigation */
  direction?: RovingDirection;
  /** Whether navigation wraps around at boundaries */
  loop?: boolean;
  /** Selector for focusable items within the container */
  itemSelector?: string;
};

/**
 * Provides arrow-key roving tabindex navigation for widget groups.
 * Only one item in the group receives `tabIndex={0}`;
 * the rest get `tabIndex={-1}`. Arrow keys move focus between items.
 *
 * @param containerRef - Ref to the group container element
 * @param options - Configuration for direction, looping, and item selector
 * @returns `onKeyDown` handler to attach to the container
 */
export function useRovingTabIndex(
  containerRef: RefObject<HTMLElement | null>,
  options: UseRovingTabIndexOptions = {}
) {
  const {
    direction = "horizontal",
    loop = true,
    itemSelector = '[role="tab"], [role="radio"], [role="menuitem"], [role="option"], button:not([disabled])',
  } = options;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const allItems = Array.from(
        container.querySelectorAll<HTMLElement>(itemSelector)
      ).filter((el) => !el.hasAttribute("disabled"));

      if (allItems.length === 0) return;

      const currentIndex = allItems.indexOf(document.activeElement as HTMLElement);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      const prevKeys = direction === "vertical" ? ["ArrowUp"] : direction === "horizontal" ? ["ArrowLeft"] : ["ArrowLeft", "ArrowUp"];
      const nextKeys = direction === "vertical" ? ["ArrowDown"] : direction === "horizontal" ? ["ArrowRight"] : ["ArrowRight", "ArrowDown"];

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? allItems.length - 1 : 0;
        }
      } else if (nextKeys.includes(e.key)) {
        e.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= allItems.length) {
          nextIndex = loop ? 0 : allItems.length - 1;
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = allItems.length - 1;
      }

      if (nextIndex !== null && nextIndex !== currentIndex) {
        // Update tabindex
        allItems[currentIndex].setAttribute("tabindex", "-1");
        allItems[nextIndex].setAttribute("tabindex", "0");
        allItems[nextIndex].focus();
      }
    },
    [containerRef, direction, loop, itemSelector]
  );

  return { onKeyDown };
}

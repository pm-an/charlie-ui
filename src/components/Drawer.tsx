"use client";

import {
  type ReactNode,
  type HTMLAttributes,
  useRef,
  useId,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useScrollLock } from "../hooks/useScrollLock";

/* ─── Slide animation variants ────────────── */

const slideVariants = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
};

const springTransition = { type: "spring" as const, damping: 30, stiffness: 300 };

/* ─── Size variants ───────────────────────── */

const drawerVariants = cva("fixed z-50 flex flex-col bg-bg-200 shadow-xl", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
      full: "",
    },
    side: {
      right: "right-0 top-0 h-full border-l border-white/10",
      left: "left-0 top-0 h-full border-r border-white/10",
      top: "top-0 left-0 w-full border-b border-white/10",
      bottom: "bottom-0 left-0 w-full border-t border-white/10",
    },
  },
  compoundVariants: [
    // Horizontal drawers (left/right) — width sizes
    { side: "right", size: "sm", class: "w-[320px]" },
    { side: "right", size: "md", class: "w-[420px]" },
    { side: "right", size: "lg", class: "w-[560px]" },
    { side: "right", size: "full", class: "w-screen" },
    { side: "left", size: "sm", class: "w-[320px]" },
    { side: "left", size: "md", class: "w-[420px]" },
    { side: "left", size: "lg", class: "w-[560px]" },
    { side: "left", size: "full", class: "w-screen" },
    // Vertical drawers (top/bottom) — height sizes
    { side: "top", size: "sm", class: "h-[240px]" },
    { side: "top", size: "md", class: "h-[360px]" },
    { side: "top", size: "lg", class: "h-[480px]" },
    { side: "top", size: "full", class: "h-screen" },
    { side: "bottom", size: "sm", class: "h-[240px]" },
    { side: "bottom", size: "md", class: "h-[360px]" },
    { side: "bottom", size: "lg", class: "h-[480px]" },
    { side: "bottom", size: "full", class: "h-screen" },
  ],
  defaultVariants: {
    side: "right",
    size: "md",
  },
});

/* ─── Types ────────────────────────────────── */

export type DrawerProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  title?: string;
  description?: string;
  showClose?: boolean;
  overlay?: boolean;
  children: ReactNode;
};

/* ─── Drawer ───────────────────────────────── */

function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  title,
  description,
  showClose = true,
  overlay = true,
  children,
  className,
  ...props
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Shared hooks */
  useEscapeKey(onClose, open);
  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useFocusReturn(open);

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" {...props}>
          {/* Backdrop */}
          {overlay && (
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              data-testid="drawer-backdrop"
            />
          )}

          {/* Panel */}
          <motion.div
            ref={panelRef}
            data-slot="drawer"
            className={cn(
              drawerVariants({ side, size }),
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            data-state={open ? "open" : "closed"}
            initial={slideVariants[side].initial}
            animate={slideVariants[side].animate}
            exit={slideVariants[side].exit}
            transition={springTransition}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="min-w-0">
                  {title && (
                    <h2
                      id={titleId}
                      className="text-lg font-semibold text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descriptionId}
                      className="text-sm text-white/60 mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {showClose && (
                  <button
                    type="button"
                    className="shrink-0 rounded-md p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

Drawer.displayName = "Drawer";

export { Drawer, drawerVariants };

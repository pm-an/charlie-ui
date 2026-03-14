"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Slot } from "../utils/Slot";

/* ─── Context ───────────────────────────────── */

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const PopoverContext = createContext<PopoverContextType | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx)
    throw new Error(
      "Popover compound components must be used within <Popover>"
    );
  return ctx;
}

/* ─── Popover Root ──────────────────────────── */

export type PopoverProps = {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Popover({ children, className, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const contextValue = useMemo(
    () => ({ open, setOpen, triggerRef }),
    [open, setOpen]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <div data-slot="popover" className={cn("relative inline-block", className)} data-state={open ? "open" : "closed"}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

Popover.displayName = "Popover";

/* ─── Popover.Trigger ───────────────────────── */

export type PopoverTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

function PopoverTrigger({ children, className, asChild = false }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext();

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  if (asChild) {
    return (
      <Slot
        ref={triggerRef as React.Ref<HTMLElement>}
        className={className}
        onClick={handleClick}
      >
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

PopoverTrigger.displayName = "Popover.Trigger";

/* ─── Popover.Content ───────────────────────── */

export type PopoverContentProps = {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "bottom" | "top";
  sideOffset?: number;
  /** Whether clicking outside the popover dismisses it. Defaults to `true`. */
  dismissible?: boolean;
};

function PopoverContent({
  children,
  className,
  align = "center",
  side = "bottom",
  sideOffset = 8,
  dismissible = true,
}: PopoverContentProps) {
  const { open, setOpen } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open || !dismissible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, dismissible]);

  // Close on click outside
  useEffect(() => {
    if (!open || !dismissible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const content = contentRef.current;
      if (content && !content.contains(target)) {
        // Also check if the click is on the trigger (toggle handled by trigger itself)
        const popoverRoot = content.closest("[data-slot='popover']");
        if (popoverRoot && popoverRoot.contains(target)) {
          return; // Let trigger button handle its own click
        }
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen, dismissible]);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = side === "bottom" ? "top-full" : "bottom-full";

  const motionConfig =
    side === "bottom"
      ? {
          initial: { opacity: 0, y: -4 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -4 },
        }
      : {
          initial: { opacity: 0, y: 4 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 4 },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          className={cn(
            "absolute z-50 min-w-[220px]",
            "bg-grey-700 border border-white/[0.06] rounded-xl shadow-window p-4",
            sideClasses,
            alignClasses[align],
            className
          )}
          style={{
            [side === "bottom" ? "marginTop" : "marginBottom"]: `${sideOffset}px`,
          }}
          initial={motionConfig.initial}
          animate={motionConfig.animate}
          exit={motionConfig.exit}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

PopoverContent.displayName = "Popover.Content";

/* ─── Popover.Close ─────────────────────────── */

export type PopoverCloseProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

function PopoverClose({ children, className, asChild = false }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();

  const handleClick = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (asChild) {
    return (
      <Slot className={className} onClick={handleClick}>
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

PopoverClose.displayName = "Popover.Close";

/* ─── Compound Export ───────────────────────── */

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;

export { Popover };

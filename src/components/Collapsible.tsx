"use client";

import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useControllableState } from "../hooks/useControllableState";

/* ─── Context ────────────────────────────────── */

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
  contentId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx)
    throw new Error(
      "Collapsible.Trigger/Content must be used within a Collapsible"
    );
  return ctx;
}

/* ─── Collapsible Root ───────────────────────── */

export type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

function CollapsibleRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const [open, setOpen] = useControllableState(
    controlledOpen,
    defaultOpen ?? false,
    onOpenChange
  );
  const contentId = useId();

  const toggle = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  return (
    <CollapsibleContext.Provider
      value={{ open, toggle, disabled, contentId }}
    >
      <div data-slot="collapsible" className={cn(className)} data-state={open ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

CollapsibleRoot.displayName = "Collapsible";

/* ─── Collapsible Trigger ────────────────────── */

export type CollapsibleTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

function CollapsibleTrigger({
  asChild = false,
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const { open, toggle, disabled, contentId } = useCollapsible();

  const triggerProps = {
    "aria-expanded": open,
    "aria-controls": contentId,
    disabled,
    onClick: toggle,
  };

  if (asChild && children) {
    return (
      <span
        data-slot="collapsible-trigger"
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(className)}
        aria-expanded={open}
        aria-controls={contentId}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) toggle();
          }
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      className={cn(className)}
      {...triggerProps}
      {...props}
    >
      {children}
    </button>
  );
}

CollapsibleTrigger.displayName = "Collapsible.Trigger";

/* ─── Collapsible Content ────────────────────── */

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsibleContentProps) {
  const { open, contentId } = useCollapsible();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          data-slot="collapsible-content"
          id={contentId}
          role="region"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          className={cn(className)}
          {...(props as Record<string, unknown>)}
        >
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

CollapsibleContent.displayName = "Collapsible.Content";

/* ─── Compound Export ────────────────────────── */

const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});

export { Collapsible };

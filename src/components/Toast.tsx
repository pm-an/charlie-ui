"use client";

import { type ReactNode, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

const toastVariants = cva("", {
  variants: {
    variant: {
      default: "",
      success: "",
      error: "",
      warning: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const variantIcons = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
} as const;

const variantIconColors = {
  default: "text-blue",
  success: "text-green",
  error: "text-red",
  warning: "text-yellow",
} as const;

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastProps = VariantProps<typeof toastVariants> & {
    title: string;
    description?: string;
    action?: ReactNode;
    onClose?: () => void;
    duration?: number;
    open?: boolean;
    className?: string;
    /** Where the toast appears on screen. Default "bottom-right". */
    position?: ToastPosition;
  };

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "fixed top-4 left-4 md:top-6 md:left-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "top-center": "fixed top-4 left-1/2 -translate-x-1/2 md:top-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "top-right": "fixed top-4 right-4 md:top-6 md:right-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "middle-left": "fixed top-1/2 left-4 -translate-y-1/2 md:left-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "middle-center": "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 md:min-w-[320px] md:max-w-[420px]",
  "middle-right": "fixed top-1/2 right-4 -translate-y-1/2 md:right-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "bottom-left": "fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 z-50 md:min-w-[320px] md:max-w-[420px]",
  "bottom-right": "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 md:min-w-[320px] md:max-w-[420px]",
};

const positionAnimations: Record<ToastPosition, { initial: Record<string, number>; exit: Record<string, number> }> = {
  "top-left": { initial: { opacity: 0, x: -24, scale: 0.96 }, exit: { opacity: 0, x: -24, scale: 0.96 } },
  "top-center": { initial: { opacity: 0, y: -24, scale: 0.96 }, exit: { opacity: 0, y: -24, scale: 0.96 } },
  "top-right": { initial: { opacity: 0, x: 24, scale: 0.96 }, exit: { opacity: 0, x: 24, scale: 0.96 } },
  "middle-left": { initial: { opacity: 0, x: -24, scale: 0.96 }, exit: { opacity: 0, x: -24, scale: 0.96 } },
  "middle-center": { initial: { opacity: 0, scale: 0.9 }, exit: { opacity: 0, scale: 0.9 } },
  "middle-right": { initial: { opacity: 0, x: 24, scale: 0.96 }, exit: { opacity: 0, x: 24, scale: 0.96 } },
  "bottom-left": { initial: { opacity: 0, x: -24, scale: 0.96 }, exit: { opacity: 0, x: -24, scale: 0.96 } },
  "bottom-center": { initial: { opacity: 0, y: 24, scale: 0.96 }, exit: { opacity: 0, y: 24, scale: 0.96 } },
  "bottom-right": { initial: { opacity: 0, y: 24, scale: 0.96 }, exit: { opacity: 0, y: 24, scale: 0.96 } },
};

function Toast({
  className,
  variant = "default",
  title,
  description,
  action,
  onClose,
  duration = 5000,
  open = true,
  position = "bottom-right",
}: ToastProps) {
  const resolvedVariant = variant ?? "default";
  const Icon = variantIcons[resolvedVariant];
  const iconColor = variantIconColors[resolvedVariant];
  const resolvedPosition = position ?? "bottom-right";
  const anim = positionAnimations[resolvedPosition];

  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-slot="toast"
          data-position={resolvedPosition}
          className={cn(
            positionClasses[resolvedPosition],
            "rounded-xl border border-white/10 bg-grey-700 p-4 shadow-window",
            className
          )}
          initial={anim.initial}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={anim.exit}
          transition={{ duration: 0.26, ease: "easeOut" }}
          role="alert"
        >
          <div className="flex gap-3">
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{title}</p>
              {description && (
                <p className="mt-0.5 text-xs text-white/60">{description}</p>
              )}
              {action && <div className="mt-2">{action}</div>}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="absolute right-2 top-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 transition-colors hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

Toast.displayName = "Toast";

export { Toast, toastVariants };

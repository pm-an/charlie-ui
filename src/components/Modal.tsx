"use client";

import {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  useEffect,
  useCallback,
  useId,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

/* ─── Size variants (standard mode only) ──── */

const modalVariants = cva(
  [
    "relative w-[calc(100%-32px)] md:w-full overflow-hidden rounded-xl",
    "border border-white/[0.06] bg-grey-700 shadow-window",
  ],
  {
    variants: {
      size: {
        sm: "max-w-[400px]",
        md: "max-w-[540px]",
        lg: "max-w-[640px]",
        xl: "max-w-[780px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* ─── Modal (root) ──────────────────────────── */

type ModalProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof modalVariants> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    title?: string;
    description?: string;
    showClose?: boolean;
    /** Whether the modal can be dismissed via backdrop click, Escape key, or close button. Default true. */
    dismissable?: boolean;
    /** Whether clicking the backdrop closes the modal. Overrides dismissable for backdrop only. */
    closeOnBackdropClick?: boolean;
    /** Whether pressing Escape closes the modal. Overrides dismissable for Escape only. */
    closeOnEscape?: boolean;
    /** When true, the modal renders at near-full viewport size instead of a centered dialog. */
    fullscreen?: boolean;
  };

function ModalRoot({
  className,
  open,
  onOpenChange,
  children,
  size,
  title,
  description,
  showClose = true,
  dismissable = true,
  closeOnBackdropClick,
  closeOnEscape,
  fullscreen = false,
  ...props
}: ModalProps) {
  const titleId = useId();

  const canCloseOnEscape = closeOnEscape ?? dismissable;
  const canCloseOnBackdrop = closeOnBackdropClick ?? dismissable;
  const canShowClose = showClose && dismissable;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && canCloseOnEscape) onOpenChange(false);
    },
    [onOpenChange, canCloseOnEscape]
  );

  /* Escape key listener */
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50",
            !fullscreen && "flex items-center justify-center"
          )}
          {...props}
        >
          {/* Backdrop */}
          <motion.div
            className={cn(
              "absolute inset-0 bg-black/60",
              !fullscreen && "backdrop-blur-sm"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (canCloseOnBackdrop) onOpenChange(false);
            }}
            data-testid={fullscreen ? "fullscreen-modal-backdrop" : "modal-backdrop"}
          />

          {/* Dialog panel */}
          <motion.div
            data-slot={fullscreen ? "fullscreen-modal" : "modal"}
            className={
              fullscreen
                ? cn(
                    "absolute inset-4 md:inset-6 flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-grey-700 shadow-window",
                    className
                  )
                : cn(modalVariants({ size }), className)
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            data-state={open ? "open" : "closed"}
            initial={
              fullscreen
                ? { opacity: 0, scale: 0.98 }
                : { opacity: 0, scale: 0.96, y: -8 }
            }
            animate={
              fullscreen
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              fullscreen
                ? { opacity: 0, scale: 0.98 }
                : { opacity: 0, scale: 0.96, y: -8 }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Built-in header when title is provided */}
            {(title || canShowClose) && (
              <div
                className={cn(
                  "flex justify-between border-b border-white/[0.06] px-6 py-4",
                  fullscreen
                    ? "sticky top-0 z-10 items-center bg-grey-700"
                    : "items-start gap-4"
                )}
              >
                <div className={fullscreen ? undefined : "min-w-0"}>
                  {title && (
                    <h2
                      id={titleId}
                      className={cn(
                        "font-semibold text-white",
                        fullscreen ? "text-lg" : "text-base"
                      )}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-white/60">{description}</p>
                  )}
                </div>

                {canShowClose && (
                  <button
                    type="button"
                    className={cn(
                      "shrink-0 rounded-md transition-colors",
                      fullscreen
                        ? "flex h-8 w-8 items-center justify-center text-white/60 hover:bg-white/5 hover:text-white"
                        : "p-1 text-white/40 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content wrapper — fullscreen wraps children in scrollable flex area */}
            {fullscreen ? (
              <div className="flex-1 overflow-y-auto">{children}</div>
            ) : (
              children
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

ModalRoot.displayName = "Modal";

/* ─── Modal.Header ──────────────────────────── */

const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="modal-header"
      className={cn(
        "border-b border-white/[0.06] px-6 py-4",
        className
      )}
      {...props}
    />
  )
);
ModalHeader.displayName = "Modal.Header";

/* ─── Modal.Body ────────────────────────────── */

const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="modal-body"
      className={cn("max-h-[60vh] overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  )
);
ModalBody.displayName = "Modal.Body";

/* ─── Modal.Footer ──────────────────────────── */

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="modal-footer"
      className={cn(
        "flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4",
        className
      )}
      {...props}
    />
  )
);
ModalFooter.displayName = "Modal.Footer";

/* ─── Compound Export ───────────────────────── */

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { Modal, modalVariants };
export type { ModalProps };

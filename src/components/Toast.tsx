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

export type ToastProps = VariantProps<typeof toastVariants> & {
    title: string;
    description?: string;
    action?: ReactNode;
    onClose?: () => void;
    duration?: number;
    open?: boolean;
    className?: string;
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
}: ToastProps) {
  const resolvedVariant = variant ?? "default";
  const Icon = variantIcons[resolvedVariant];
  const iconColor = variantIconColors[resolvedVariant];

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
          className={cn(
            "fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 md:min-w-[320px] md:max-w-[420px]",
            "rounded-xl border border-white/10 bg-grey-700 p-4 shadow-window",
            className
          )}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
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

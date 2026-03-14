import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

const alertVariants = cva(
  "relative flex gap-3 rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white/5 border-white/10 text-white/80",
        info: "bg-blue-muted border-blue/20 text-blue",
        success: "bg-green-muted border-green/20 text-green",
        warning: "bg-yellow-muted border-yellow/20 text-yellow",
        error: "bg-red-muted border-red/20 text-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const variantIcons = {
  default: null,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
} as const;

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    icon?: ReactNode;
    closable?: boolean;
    onClose?: () => void;
    action?: ReactNode;
  };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      icon,
      closable = false,
      onClose,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? "default";
    const DefaultIcon = variantIcons[resolvedVariant];

    const renderedIcon =
      icon !== undefined
        ? icon
        : DefaultIcon
          ? <DefaultIcon className="mt-0.5 h-5 w-5 shrink-0" />
          : null;

    const role =
      resolvedVariant === "error" || resolvedVariant === "warning"
        ? "alert"
        : "status";

    return (
      <div
        ref={ref}
        data-slot="alert"
        role={role}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {renderedIcon}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-medium text-sm">{title}</p>
          )}
          {children && (
            <div className={cn("text-sm opacity-80", title && "mt-1")}>
              {children}
            </div>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>
        {closable && (
          <button
            type="button"
            className="shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };

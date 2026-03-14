import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const progressVariants = cva("", {
  variants: {
    variant: {
      linear: "",
      circular: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    color: {
      accent: "",
      blue: "",
      green: "",
      yellow: "",
    },
  },
  defaultVariants: {
    variant: "linear",
    size: "md",
    color: "accent",
  },
});

const trackSizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
} as const;

const fillColorClasses = {
  accent: "bg-accent",
  blue: "bg-blue",
  green: "bg-green",
  yellow: "bg-yellow",
} as const;

const strokeColors = {
  accent: "var(--color-accent, #ff6363)",
  blue: "var(--color-blue, #56c2ff)",
  green: "var(--color-green, #59d499)",
  yellow: "var(--color-yellow, #ffa500)",
} as const;

const circularSizes = {
  sm: { size: 32, strokeWidth: 3 },
  md: { size: 48, strokeWidth: 4 },
  lg: { size: 64, strokeWidth: 5 },
} as const;

const valueFontSizes = {
  sm: "text-[8px]",
  md: "text-xs",
  lg: "text-sm",
} as const;

export type ProgressProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressVariants> & {
    value?: number;
    label?: string;
    showValue?: boolean;
    indeterminate?: boolean;
  };

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      variant = "linear",
      size = "md",
      color = "accent",
      value,
      label,
      showValue = false,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? "linear";
    const resolvedSize = size ?? "md";
    const resolvedColor = color ?? "accent";

    const clampedValue =
      value !== undefined ? Math.max(0, Math.min(100, value)) : 0;

    const ariaProps = {
      role: "progressbar" as const,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      ...(indeterminate
        ? {}
        : { "aria-valuenow": clampedValue }),
      "aria-label": label ?? (indeterminate ? "Loading" : `${clampedValue}% complete`),
    };

    if (resolvedVariant === "circular") {
      const { size: svgSize, strokeWidth } = circularSizes[resolvedSize];
      const radius = (svgSize - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (clampedValue / 100) * circumference;

      return (
        <div
          ref={ref}
          data-slot="progress"
          className={cn("inline-flex flex-col items-center gap-1", className)}
          {...ariaProps}
          {...props}
        >
          <div className="relative" style={{ width: svgSize, height: svgSize }}>
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className={cn(indeterminate && "animate-spin")}
            >
              {/* Track circle */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                fill="none"
                stroke={strokeColors[resolvedColor]}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
                transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                className="transition-all duration-300"
              />
            </svg>
            {showValue && !indeterminate && (
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center font-medium text-white/80",
                  valueFontSizes[resolvedSize]
                )}
              >
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
          {label && (
            <span className="text-xs text-white/70">{label}</span>
          )}
        </div>
      );
    }

    // Linear variant
    return (
      <div
        ref={ref}
        data-slot="progress"
        className={cn("w-full", className)}
        {...ariaProps}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex-1 bg-white/10 rounded-full overflow-hidden",
              trackSizeClasses[resolvedSize]
            )}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                fillColorClasses[resolvedColor],
                indeterminate && "animate-progress-indeterminate"
              )}
              style={
                indeterminate
                  ? { width: "40%" }
                  : { width: `${clampedValue}%` }
              }
            />
          </div>
          {showValue && !indeterminate && (
            <span className="text-xs font-medium text-white/70 tabular-nums">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
        {label && (
          <span className="mt-1 block text-xs text-white/70">{label}</span>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress, progressVariants };

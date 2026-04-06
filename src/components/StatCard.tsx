import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "./Skeleton";

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  prefix?: string;
  suffix?: string;
  loading?: boolean;
};

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      change,
      changeLabel,
      icon,
      trend,
      prefix,
      suffix,
      loading = false,
      ...props
    },
    ref
  ) => {
    const resolvedTrend =
      trend ??
      (change !== undefined
        ? change > 0
          ? "up"
          : change < 0
            ? "down"
            : "neutral"
        : undefined);

    const formattedValue = `${prefix ?? ""}${value}${suffix ?? ""}`;

    return (
      <div
        ref={ref}
        data-slot="stat-card"
        className={cn(
          "rounded-lg border border-border bg-card-gradient p-6 shadow-card-inset",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-subtle text-fg-200">
            {icon}
          </div>
        )}

        <p className="mb-1 text-sm text-fg-200">{label}</p>

        {loading ? (
          <>
            <Skeleton variant="text" width="60%" height={36} className="mb-2" />
            <Skeleton variant="text" width="40%" height={20} />
          </>
        ) : (
          <>
            <p className="text-3xl font-semibold tracking-tight text-text-loud">
              {formattedValue}
            </p>

            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1.5 text-sm">
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    resolvedTrend === "up" && "text-green",
                    resolvedTrend === "down" && "text-red",
                    resolvedTrend === "neutral" && "text-fg-200"
                  )}
                >
                  {resolvedTrend === "up" && (
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {resolvedTrend === "down" && (
                    <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-fg-200">{changeLabel}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };

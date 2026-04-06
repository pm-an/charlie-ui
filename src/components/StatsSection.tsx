import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { StatCard } from "./StatCard";

const statsSectionVariants = cva("", {
  variants: {
    variant: {
      cards: "",
      simple: "",
    },
  },
  defaultVariants: {
    variant: "cards",
  },
});

export type StatItem = {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  prefix?: string;
  suffix?: string;
};

export type StatsSectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof statsSectionVariants> & {
    eyebrow?: string;
    title?: string;
    description?: string;
    stats: StatItem[];
    columns?: 2 | 3 | 4;
  };

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

function getAutoColumns(count: number): 2 | 3 | 4 {
  if (count <= 2) return 2;
  if (count === 3) return 3;
  return 4;
}

const StatsSection = forwardRef<HTMLElement, StatsSectionProps>(
  (
    {
      className,
      variant = "cards",
      eyebrow,
      title,
      description,
      stats,
      columns,
      ...props
    },
    ref
  ) => {
    const hasHeader = eyebrow || title || description;
    const resolvedColumns = columns ?? getAutoColumns(stats.length);

    return (
      <section
        ref={ref}
        data-slot="stats-section"
        className={cn(
          "py-12 md:py-20",
          statsSectionVariants({ variant }),
          className
        )}
        {...props}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {hasHeader && (
            <div className="text-center mb-8 md:mb-12">
              {eyebrow && (
                <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-text-loud text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-fg-200 text-base md:text-lg mt-3 md:mt-4 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className={cn("grid gap-4 md:gap-6", columnClasses[resolvedColumns])}>
            {stats.map((stat) =>
              variant === "cards" ? (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              ) : (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center py-6"
                >
                  <p className="text-3xl md:text-4xl font-semibold tracking-tight text-text-loud">
                    {stat.prefix ?? ""}
                    {stat.value}
                    {stat.suffix ?? ""}
                  </p>
                  <p className="mt-2 text-sm text-fg-200">{stat.label}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }
);

StatsSection.displayName = "StatsSection";

export { StatsSection, statsSectionVariants };

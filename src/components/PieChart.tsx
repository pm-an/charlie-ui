import { forwardRef, useId, type HTMLAttributes } from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  resolveChartColor,
  getTooltipStyles,
  getLegendStyle,
  createChartSummary,
} from "../utils/chart-helpers";
import { cn } from "../utils/cn";

export type PieChartDataItem = {
  name: string;
  value: number;
  color?: string;
};

export type PieChartProps = Omit<HTMLAttributes<HTMLDivElement>, "data"> & {
  data: PieChartDataItem[];
  variant?: "pie" | "donut";
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  label?: string;
  labelValue?: string;
  /** Accessible description for screen readers */
  description?: string;
};

const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      variant = "pie",
      height = 300,
      showTooltip = true,
      showLegend = true,
      showLabels = false,
      innerRadius,
      outerRadius = 100,
      paddingAngle = 2,
      label,
      labelValue,
      description,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const resolvedInnerRadius =
      innerRadius !== undefined
        ? innerRadius
        : variant === "donut"
          ? 60
          : 0;

    const tooltip = getTooltipStyles();
    const descId = useId();
    const summaryText =
      description ??
      createChartSummary(data, ["value"], "name");

    return (
      <div
        ref={ref}
        data-slot="pie-chart"
        role="img"
        aria-label={ariaLabel ?? "Pie chart"}
        aria-describedby={descId}
        className={cn("relative w-full", className)}
        {...rest}
      >
        <div id={descId} className="sr-only">
          {summaryText}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={resolvedInnerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              label={showLabels || undefined}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={resolveChartColor(entry.color, index)}
                />
              ))}
            </Pie>

            {showTooltip && (
              <Tooltip
                contentStyle={tooltip.contentStyle}
                labelStyle={tooltip.labelStyle}
                itemStyle={tooltip.itemStyle}
              />
            )}

            {showLegend && (
              <Legend wrapperStyle={getLegendStyle()} />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>

        {variant === "donut" && (label || labelValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {labelValue && (
              <span className="text-2xl font-semibold text-text-loud">
                {labelValue}
              </span>
            )}
            {label && (
              <span className="text-sm text-fg-200">{label}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

PieChart.displayName = "PieChart";

export { PieChart };

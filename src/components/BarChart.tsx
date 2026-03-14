import { forwardRef, useId, type HTMLAttributes } from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  resolveChartColor,
  getTooltipStyles,
  getAxisTickStyle,
  getLegendStyle,
  gridStroke,
  createChartSummary,
} from "../utils/chart-helpers";
import { cn } from "../utils/cn";

export type BarChartBar = {
  dataKey: string;
  color?: string;
  radius?: number;
  label?: string;
  stackId?: string;
};

export type BarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "data"> & {
  data: Record<string, unknown>[];
  bars: BarChartBar[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  layout?: "horizontal" | "vertical";
  barGap?: number;
  /** Accessible description for screen readers */
  description?: string;
};

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      bars,
      xAxisKey = "name",
      height = 300,
      showGrid = true,
      showTooltip = true,
      showLegend = false,
      showXAxis = true,
      showYAxis = true,
      layout = "horizontal",
      barGap = 4,
      description,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const tooltip = getTooltipStyles();
    const tickStyle = getAxisTickStyle();
    const descId = useId();
    const summaryText =
      description ??
      createChartSummary(
        data,
        bars.map((b) => b.dataKey),
        xAxisKey,
      );

    return (
      <div
        ref={ref}
        data-slot="bar-chart"
        role="img"
        aria-label={ariaLabel ?? "Bar chart"}
        aria-describedby={descId}
        className={cn("w-full", className)}
        {...rest}
      >
        <div id={descId} className="sr-only">
          {summaryText}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} layout={layout} barGap={barGap}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            )}

            {layout === "horizontal" ? (
              <>
                {showXAxis && (
                  <XAxis
                    dataKey={xAxisKey}
                    tick={tickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                )}
                {showYAxis && (
                  <YAxis
                    tick={tickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                )}
              </>
            ) : (
              <>
                {showYAxis && (
                  <YAxis
                    dataKey={xAxisKey}
                    type="category"
                    tick={tickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                )}
                {showXAxis && (
                  <XAxis
                    type="number"
                    tick={tickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                )}
              </>
            )}

            {showTooltip && (
              <Tooltip
                contentStyle={tooltip.contentStyle}
                labelStyle={tooltip.labelStyle}
                itemStyle={tooltip.itemStyle}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
            )}

            {showLegend && (
              <Legend wrapperStyle={getLegendStyle()} />
            )}

            {bars.map((bar, index) => {
              const r = bar.radius ?? 4;
              return (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.label ?? bar.dataKey}
                  fill={resolveChartColor(bar.color, index)}
                  radius={[r, r, 0, 0]}
                  stackId={bar.stackId}
                />
              );
            })}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

BarChart.displayName = "BarChart";

export { BarChart };

import { forwardRef, useId, type HTMLAttributes } from "react";
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
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

export type AreaChartArea = {
  dataKey: string;
  color?: string;
  fillOpacity?: number;
  label?: string;
  stackId?: string;
};

export type AreaChartProps = Omit<HTMLAttributes<HTMLDivElement>, "data"> & {
  data: Record<string, unknown>[];
  areas: AreaChartArea[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  curveType?: "monotone" | "linear" | "step" | "natural";
  /** Accessible description for screen readers */
  description?: string;
};

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      areas,
      xAxisKey = "name",
      height = 300,
      showGrid = true,
      showTooltip = true,
      showLegend = false,
      showXAxis = true,
      showYAxis = true,
      curveType = "monotone",
      description,
      className,
      "aria-label": ariaLabel,
      ...props
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
        areas.map((a) => a.dataKey),
        xAxisKey,
      );

    return (
      <div
        ref={ref}
        data-slot="area-chart"
        role="img"
        aria-label={ariaLabel ?? "Area chart"}
        aria-describedby={descId}
        className={cn("w-full", className)}
        {...props}
      >
        <div id={descId} className="sr-only">
          {summaryText}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart data={data}>
            <defs>
              {areas.map((area, index) => {
                const color = resolveChartColor(area.color, index);
                const opacity = area.fillOpacity ?? 0.15;
                return (
                  <linearGradient
                    key={area.dataKey}
                    id={`gradient-${area.dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={opacity} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            )}
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
            {showTooltip && (
              <Tooltip
                contentStyle={tooltip.contentStyle}
                labelStyle={tooltip.labelStyle}
                itemStyle={tooltip.itemStyle}
                cursor={{ stroke: "rgba(255,255,255,0.1)" }}
              />
            )}
            {showLegend && (
              <Legend wrapperStyle={getLegendStyle()} />
            )}
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type={curveType}
                dataKey={area.dataKey}
                stroke={resolveChartColor(area.color, index)}
                fill={`url(#gradient-${area.dataKey})`}
                strokeWidth={2}
                name={area.label ?? area.dataKey}
                stackId={area.stackId}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

AreaChart.displayName = "AreaChart";

export { AreaChart };

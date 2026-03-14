import { forwardRef, useId, type HTMLAttributes } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
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

export type LineChartLine = {
  dataKey: string;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  label?: string;
};

export type LineChartProps = Omit<HTMLAttributes<HTMLDivElement>, "data"> & {
  data: Record<string, unknown>[];
  lines: LineChartLine[];
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

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      lines,
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
        lines.map((l) => l.dataKey),
        xAxisKey,
      );

    return (
      <div
        ref={ref}
        data-slot="line-chart"
        role="img"
        aria-label={ariaLabel ?? "Line chart"}
        aria-describedby={descId}
        className={cn("w-full", className)}
        {...props}
      >
        <div id={descId} className="sr-only">
          {summaryText}
        </div>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data}>
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
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type={curveType}
                dataKey={line.dataKey}
                stroke={resolveChartColor(line.color, index)}
                strokeWidth={line.strokeWidth ?? 2}
                strokeDasharray={line.dashed ? "5 5" : undefined}
                dot={false}
                name={line.label ?? line.dataKey}
                activeDot={{ r: 4, strokeWidth: 0, fill: resolveChartColor(line.color, index) }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

LineChart.displayName = "LineChart";

export { LineChart };

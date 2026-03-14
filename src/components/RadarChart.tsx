import { forwardRef, type HTMLAttributes } from "react";
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  resolveChartColor,
  getTooltipStyles,
  getAxisTickStyle,
  getLegendStyle,
  gridStroke,
} from "../utils/chart-helpers";
import { cn } from "../utils/cn";

export type RadarChartRadar = {
  dataKey: string;
  color?: string;
  fillOpacity?: number;
  label?: string;
};

export type RadarChartProps = Omit<HTMLAttributes<HTMLDivElement>, "data"> & {
  data: Record<string, unknown>[];
  radars: RadarChartRadar[];
  subjectKey?: string;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
};

const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      data,
      radars,
      subjectKey = "subject",
      height = 300,
      showTooltip = true,
      showLegend = false,
      showGrid = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const tooltip = getTooltipStyles();
    const tickStyle = getAxisTickStyle();

    return (
      <div
        ref={ref}
        data-slot="radar-chart"
        className={cn("w-full", className)}
        {...rest}
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            {showGrid && <PolarGrid stroke={gridStroke} />}
            <PolarAngleAxis
              dataKey={subjectKey}
              tick={tickStyle}
            />
            <PolarRadiusAxis
              tick={{ ...tickStyle, fontSize: 10 }}
              axisLine={false}
            />
            {radars.map((radar, index) => {
              const color = resolveChartColor(radar.color, index);
              return (
                <Radar
                  key={radar.dataKey}
                  name={radar.label ?? radar.dataKey}
                  dataKey={radar.dataKey}
                  stroke={color}
                  fill={color}
                  fillOpacity={radar.fillOpacity ?? 0.2}
                  strokeWidth={2}
                />
              );
            })}
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
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

RadarChart.displayName = "RadarChart";

export { RadarChart };

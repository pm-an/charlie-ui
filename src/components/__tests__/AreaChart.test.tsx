import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { AreaChart } from "../AreaChart";

const sampleData = [
  { name: "Jan", value: 100, other: 50 },
  { name: "Feb", value: 200, other: 80 },
  { name: "Mar", value: 150, other: 60 },
];

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("AreaChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} className="custom" />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<AreaChart ref={ref} data={sampleData} areas={[{ dataKey: "value" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} data-testid="chart" />
    );
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("renders multiple areas", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        areas={[
          { dataKey: "value", color: "accent" },
          { dataKey: "other", color: "blue" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });

  it("renders stacked areas", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        areas={[
          { dataKey: "value", stackId: "1" },
          { dataKey: "other", stackId: "1" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });

  it("renders without grid when showGrid is false", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} showGrid={false} />
    );
    expect(container.querySelector(".recharts-cartesian-grid")).not.toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(
      <AreaChart data={[]} areas={[{ dataKey: "value" }]} />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} height={200} />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });

  it("renders without axes when showXAxis and showYAxis are false", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        areas={[{ dataKey: "value" }]}
        showXAxis={false}
        showYAxis={false}
      />
    );
    expect(container.querySelector('[data-slot="area-chart"]')).toBeInTheDocument();
  });
});

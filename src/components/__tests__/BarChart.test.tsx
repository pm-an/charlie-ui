import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { BarChart } from "../BarChart";

const sampleData = [
  { name: "Mon", visits: 100, unique: 50 },
  { name: "Tue", visits: 200, unique: 80 },
  { name: "Wed", visits: 150, unique: 60 },
];

// Mock ResizeObserver which recharts needs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("BarChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} className="custom" />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<BarChart ref={ref} data={sampleData} bars={[{ dataKey: "visits" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} data-testid="chart" />
    );
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("renders multiple bars", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        bars={[
          { dataKey: "visits", color: "accent" },
          { dataKey: "unique", color: "blue" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });

  it("renders stacked bars", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        bars={[
          { dataKey: "visits", stackId: "a" },
          { dataKey: "unique", stackId: "a" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });

  it("renders without grid when showGrid is false", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} showGrid={false} />
    );
    expect(container.querySelector(".recharts-cartesian-grid")).not.toBeInTheDocument();
  });

  it("renders with vertical layout", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} layout="vertical" />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(
      <BarChart data={[]} bars={[{ dataKey: "visits" }]} />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} height={200} />
    );
    expect(container.querySelector('[data-slot="bar-chart"]')).toBeInTheDocument();
  });
});

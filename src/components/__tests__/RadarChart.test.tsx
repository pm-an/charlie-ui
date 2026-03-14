import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { RadarChart } from "../RadarChart";

const sampleData = [
  { subject: "A", score: 80, other: 60 },
  { subject: "B", score: 65, other: 70 },
  { subject: "C", score: 90, other: 50 },
  { subject: "D", score: 70, other: 80 },
];

// Mock ResizeObserver which recharts needs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("RadarChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <RadarChart data={sampleData} radars={[{ dataKey: "score" }]} />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <RadarChart data={sampleData} radars={[{ dataKey: "score" }]} className="custom" />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<RadarChart ref={ref} data={sampleData} radars={[{ dataKey: "score" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(
      <RadarChart data={sampleData} radars={[{ dataKey: "score" }]} data-testid="radar" />
    );
    expect(screen.getByTestId("radar")).toBeInTheDocument();
  });

  it("renders multiple radars", () => {
    const { container } = render(
      <RadarChart
        data={sampleData}
        radars={[
          { dataKey: "score", color: "accent" },
          { dataKey: "other", color: "blue" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("renders without grid when showGrid is false", () => {
    const { container } = render(
      <RadarChart data={sampleData} radars={[{ dataKey: "score" }]} showGrid={false} />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(
      <RadarChart data={[]} radars={[{ dataKey: "score" }]} />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(
      <RadarChart data={sampleData} radars={[{ dataKey: "score" }]} height={400} />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("uses custom subjectKey", () => {
    const data = [
      { skill: "X", v: 1 },
      { skill: "Y", v: 2 },
    ];
    const { container } = render(
      <RadarChart data={data} radars={[{ dataKey: "v" }]} subjectKey="skill" />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });

  it("renders with custom fill opacity", () => {
    const { container } = render(
      <RadarChart
        data={sampleData}
        radars={[{ dataKey: "score", fillOpacity: 0.5 }]}
      />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
  });
});

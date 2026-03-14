import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { BarChart } from "../BarChart";
import { expectNoA11yViolations } from "../../test/a11y";

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

  // Accessibility tests
  it("has role='img' on the wrapper", () => {
    render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("uses default aria-label when none provided", () => {
    render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} />
    );
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });

  it("uses custom aria-label when provided", () => {
    render(
      <BarChart
        data={sampleData}
        bars={[{ dataKey: "visits" }]}
        aria-label="Daily site visits"
      />
    );
    expect(screen.getByLabelText("Daily site visits")).toBeInTheDocument();
  });

  it("renders sr-only description with auto-generated summary", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly!.textContent).toContain("3 data points");
    expect(srOnly!.textContent).toContain("visits:");
  });

  it("renders sr-only description with custom description", () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        bars={[{ dataKey: "visits" }]}
        description="Visits peaked on Tuesday"
      />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly!.textContent).toBe("Visits peaked on Tuesday");
  });

  it("has aria-describedby pointing to the description", () => {
    const { container } = render(
      <BarChart data={sampleData} bars={[{ dataKey: "visits" }]} />
    );
    const wrapper = container.querySelector('[data-slot="bar-chart"]')!;
    const descId = wrapper.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(descId!)}`)?.className).toContain("sr-only");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <BarChart
        data={sampleData}
        bars={[{ dataKey: "visits" }]}
        aria-label="Test chart"
      />
    );
    await expectNoA11yViolations(container);
  });
});

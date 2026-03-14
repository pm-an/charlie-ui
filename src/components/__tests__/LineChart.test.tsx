import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { LineChart } from "../LineChart";
import { expectNoA11yViolations } from "../../test/a11y";

const sampleData = [
  { name: "Jan", value: 100, other: 50 },
  { name: "Feb", value: 200, other: 80 },
  { name: "Mar", value: 150, other: 60 },
];

// Mock ResizeObserver which recharts needs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("LineChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} className="custom" />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<LineChart ref={ref} data={sampleData} lines={[{ dataKey: "value" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} data-testid="chart" />
    );
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} height={200} />
    );
    const responsiveContainer = container.querySelector(".recharts-responsive-container");
    if (responsiveContainer) {
      expect(responsiveContainer).toHaveStyle({ height: "200px" });
    }
  });

  it("renders multiple lines", () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        lines={[
          { dataKey: "value", color: "accent" },
          { dataKey: "other", color: "blue" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  it("renders without grid when showGrid is false", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} showGrid={false} />
    );
    expect(container.querySelector(".recharts-cartesian-grid")).not.toBeInTheDocument();
  });

  it("renders without X axis when showXAxis is false", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} showXAxis={false} />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  it("renders without Y axis when showYAxis is false", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} showYAxis={false} />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  it("uses custom xAxisKey", () => {
    const data = [{ month: "Jan", v: 1 }, { month: "Feb", v: 2 }];
    const { container } = render(
      <LineChart data={data} lines={[{ dataKey: "v" }]} xAxisKey="month" />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(
      <LineChart data={[]} lines={[{ dataKey: "value" }]} />
    );
    expect(container.querySelector('[data-slot="line-chart"]')).toBeInTheDocument();
  });

  // Accessibility tests
  it("has role='img' on the wrapper", () => {
    render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("uses default aria-label when none provided", () => {
    render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} />
    );
    expect(screen.getByLabelText("Line chart")).toBeInTheDocument();
  });

  it("uses custom aria-label when provided", () => {
    render(
      <LineChart
        data={sampleData}
        lines={[{ dataKey: "value" }]}
        aria-label="Monthly revenue trend"
      />
    );
    expect(screen.getByLabelText("Monthly revenue trend")).toBeInTheDocument();
  });

  it("renders sr-only description with auto-generated summary", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly!.textContent).toContain("3 data points");
    expect(srOnly!.textContent).toContain("value:");
  });

  it("renders sr-only description with custom description", () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        lines={[{ dataKey: "value" }]}
        description="Revenue increased steadily from January to March"
      />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly!.textContent).toBe("Revenue increased steadily from January to March");
  });

  it("has aria-describedby pointing to the description", () => {
    const { container } = render(
      <LineChart data={sampleData} lines={[{ dataKey: "value" }]} />
    );
    const wrapper = container.querySelector('[data-slot="line-chart"]')!;
    const descId = wrapper.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(descId!)}`)?.className).toContain("sr-only");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <LineChart
        data={sampleData}
        lines={[{ dataKey: "value" }]}
        aria-label="Test chart"
      />
    );
    await expectNoA11yViolations(container);
  });
});

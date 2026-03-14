import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { AreaChart } from "../AreaChart";
import { expectNoA11yViolations } from "../../test/a11y";

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

  // Accessibility tests
  it("has role='img' on the wrapper", () => {
    render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("uses default aria-label when none provided", () => {
    render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} />
    );
    expect(screen.getByLabelText("Area chart")).toBeInTheDocument();
  });

  it("uses custom aria-label when provided", () => {
    render(
      <AreaChart
        data={sampleData}
        areas={[{ dataKey: "value" }]}
        aria-label="Monthly active users"
      />
    );
    expect(screen.getByLabelText("Monthly active users")).toBeInTheDocument();
  });

  it("renders sr-only description with auto-generated summary", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly!.textContent).toContain("3 data points");
    expect(srOnly!.textContent).toContain("value:");
  });

  it("renders sr-only description with custom description", () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        areas={[{ dataKey: "value" }]}
        description="User growth over Q1"
      />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly!.textContent).toBe("User growth over Q1");
  });

  it("has aria-describedby pointing to the description", () => {
    const { container } = render(
      <AreaChart data={sampleData} areas={[{ dataKey: "value" }]} />
    );
    const wrapper = container.querySelector('[data-slot="area-chart"]')!;
    const descId = wrapper.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(descId!)}`)?.className).toContain("sr-only");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <AreaChart
        data={sampleData}
        areas={[{ dataKey: "value" }]}
        aria-label="Test chart"
      />
    );
    await expectNoA11yViolations(container);
  });
});

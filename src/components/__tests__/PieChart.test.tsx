import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { PieChart } from "../PieChart";
import { expectNoA11yViolations } from "../../test/a11y";

const sampleData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
];

// Mock ResizeObserver which recharts needs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("PieChart", () => {
  it("renders without crashing", () => {
    const { container } = render(<PieChart data={sampleData} />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<PieChart data={sampleData} className="custom" />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toHaveClass("custom");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<PieChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(<PieChart data={sampleData} data-testid="pie" />);
    expect(screen.getByTestId("pie")).toBeInTheDocument();
  });

  it("renders donut variant", () => {
    const { container } = render(<PieChart data={sampleData} variant="donut" />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toBeInTheDocument();
  });

  it("renders center label for donut variant", () => {
    render(
      <PieChart data={sampleData} variant="donut" label="Total" labelValue="900" />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("900")).toBeInTheDocument();
  });

  it("does not render center label for pie variant", () => {
    render(
      <PieChart data={sampleData} variant="pie" label="Total" labelValue="900" />,
    );
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText("900")).not.toBeInTheDocument();
  });

  it("renders with custom colors", () => {
    const colorData = [
      { name: "A", value: 100, color: "#ff0000" },
      { name: "B", value: 200, color: "#00ff00" },
    ];
    const { container } = render(<PieChart data={colorData} />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    const { container } = render(<PieChart data={[]} />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(<PieChart data={sampleData} height={200} />);
    expect(container.querySelector('[data-slot="pie-chart"]')).toBeInTheDocument();
  });

  it("merges relative class for donut label positioning", () => {
    const { container } = render(
      <PieChart data={sampleData} variant="donut" label="X" />,
    );
    expect(container.querySelector('[data-slot="pie-chart"]')).toHaveClass("relative");
  });

  // Accessibility tests
  it("has role='img' on the wrapper", () => {
    render(<PieChart data={sampleData} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("uses default aria-label when none provided", () => {
    render(<PieChart data={sampleData} />);
    expect(screen.getByLabelText("Pie chart")).toBeInTheDocument();
  });

  it("uses custom aria-label when provided", () => {
    render(
      <PieChart data={sampleData} aria-label="Device type distribution" />
    );
    expect(screen.getByLabelText("Device type distribution")).toBeInTheDocument();
  });

  it("renders sr-only description with auto-generated summary", () => {
    const { container } = render(<PieChart data={sampleData} />);
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).toBeInTheDocument();
    expect(srOnly!.textContent).toContain("3 data points");
    expect(srOnly!.textContent).toContain("value:");
  });

  it("renders sr-only description with custom description", () => {
    const { container } = render(
      <PieChart data={sampleData} description="Desktop leads with 44% share" />
    );
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly!.textContent).toBe("Desktop leads with 44% share");
  });

  it("has aria-describedby pointing to the description", () => {
    const { container } = render(<PieChart data={sampleData} />);
    const wrapper = container.querySelector('[data-slot="pie-chart"]')!;
    const descId = wrapper.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(descId!)}`)?.className).toContain("sr-only");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <PieChart data={sampleData} aria-label="Test chart" />
    );
    await expectNoA11yViolations(container);
  });
});

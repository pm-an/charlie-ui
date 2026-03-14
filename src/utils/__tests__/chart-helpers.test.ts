import { describe, it, expect } from "vitest";
import { createChartSummary } from "../chart-helpers";

describe("createChartSummary", () => {
  it("returns 'no data' message for empty data", () => {
    expect(createChartSummary([], ["value"])).toBe("Chart with no data.");
  });

  it("reports correct data point count", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
      { name: "C", value: 30 },
    ];
    const summary = createChartSummary(data, ["value"]);
    expect(summary).toContain("3 data points");
  });

  it("reports singular data point for one item", () => {
    const data = [{ name: "A", value: 10 }];
    const summary = createChartSummary(data, ["value"]);
    expect(summary).toContain("1 data point.");
  });

  it("includes min, max, and average for each series", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
      { name: "C", value: 30 },
    ];
    const summary = createChartSummary(data, ["value"]);
    expect(summary).toContain("value: min 10, max 30, average 20.");
  });

  it("includes range when categoryKey is provided", () => {
    const data = [
      { month: "Jan", value: 10 },
      { month: "Jun", value: 20 },
    ];
    const summary = createChartSummary(data, ["value"], "month");
    expect(summary).toContain("Range: Jan to Jun.");
  });

  it("handles multiple series keys", () => {
    const data = [
      { name: "A", revenue: 100, expenses: 50 },
      { name: "B", revenue: 200, expenses: 80 },
    ];
    const summary = createChartSummary(data, ["revenue", "expenses"], "name");
    expect(summary).toContain("revenue:");
    expect(summary).toContain("expenses:");
  });

  it("skips series with no numeric values", () => {
    const data = [
      { name: "A", label: "hello" },
      { name: "B", label: "world" },
    ];
    const summary = createChartSummary(data, ["label"], "name");
    // Should not contain "label:" stats since values are non-numeric
    expect(summary).not.toContain("label:");
    expect(summary).toContain("2 data points");
  });

  it("does not include range when categoryKey is missing", () => {
    const data = [
      { value: 10 },
      { value: 20 },
    ];
    const summary = createChartSummary(data, ["value"]);
    expect(summary).not.toContain("Range:");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "../StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total Revenue" value="45,231" />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("45,231")).toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<StatCard label="Users" value={2350} />);
    expect(screen.getByText("2350")).toBeInTheDocument();
  });

  it("renders prefix before value", () => {
    render(<StatCard label="Revenue" value="45,231" prefix="$" />);
    expect(screen.getByText("$45,231")).toBeInTheDocument();
  });

  it("renders suffix after value", () => {
    render(<StatCard label="Rate" value="3.24" suffix="%" />);
    expect(screen.getByText("3.24%")).toBeInTheDocument();
  });

  it("renders both prefix and suffix", () => {
    render(<StatCard label="Score" value="100" prefix="#" suffix="pts" />);
    expect(screen.getByText("#100pts")).toBeInTheDocument();
  });

  it("displays positive change with up trend", () => {
    render(
      <StatCard label="Users" value={100} change={12.5} changeLabel="vs last month" />
    );
    expect(screen.getByText(/\+12\.5%/)).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("displays negative change with down trend", () => {
    render(
      <StatCard label="Bounce" value="24.3" change={-3.2} changeLabel="vs last week" />
    );
    expect(screen.getByText(/-3\.2%/)).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("displays neutral change for zero", () => {
    render(
      <StatCard label="Views" value="8,192" change={0} changeLabel="no change" />
    );
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText("no change")).toBeInTheDocument();
  });

  it("auto-detects up trend from positive change", () => {
    const { container } = render(
      <StatCard label="Users" value={100} change={5} />
    );
    const changeEl = container.querySelector(".text-green");
    expect(changeEl).toBeInTheDocument();
  });

  it("auto-detects down trend from negative change", () => {
    const { container } = render(
      <StatCard label="Users" value={100} change={-5} />
    );
    const changeEl = container.querySelector(".text-red");
    expect(changeEl).toBeInTheDocument();
  });

  it("auto-detects neutral trend from zero change", () => {
    const { container } = render(
      <StatCard label="Users" value={100} change={0} />
    );
    const changeEl = container.querySelector(".text-white\\/40");
    expect(changeEl).toBeInTheDocument();
  });

  it("respects explicit trend prop over auto-detection", () => {
    const { container } = render(
      <StatCard label="Users" value={100} change={5} trend="down" />
    );
    const changeEl = container.querySelector(".text-red");
    expect(changeEl).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <StatCard
        label="Revenue"
        value="100"
        icon={<svg data-testid="stat-icon" />}
      />
    );
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
  });

  it("does not render icon container when no icon", () => {
    const { container } = render(
      <StatCard label="Revenue" value="100" />
    );
    expect(container.querySelector(".bg-white\\/5")).not.toBeInTheDocument();
  });

  it("shows skeleton state when loading", () => {
    render(<StatCard label="Revenue" value="100" loading />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    // Value should NOT be shown when loading
    expect(screen.queryByText("100")).not.toBeInTheDocument();
  });

  it("does not show change when loading", () => {
    render(
      <StatCard label="Revenue" value="100" change={5} changeLabel="vs last" loading />
    );
    expect(screen.queryByText(/5%/)).not.toBeInTheDocument();
    expect(screen.queryByText("vs last")).not.toBeInTheDocument();
  });

  it("does not render change row when change is undefined", () => {
    const { container } = render(
      <StatCard label="Revenue" value="100" />
    );
    expect(container.querySelector(".text-green")).not.toBeInTheDocument();
    expect(container.querySelector(".text-red")).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <StatCard label="Revenue" value="100" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(
      <StatCard label="Revenue" value="100" data-testid="stat-card" />
    );
    expect(screen.getByTestId("stat-card")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<StatCard ref={ref} label="Revenue" value="100" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

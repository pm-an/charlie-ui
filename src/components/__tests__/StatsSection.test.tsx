import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsSection } from "../StatsSection";

const mockStats = [
  { label: "Active Users", value: "12.4K", change: 14.2, trend: "up" as const },
  { label: "Revenue", value: "842", prefix: "$", suffix: "K", change: 8.1, trend: "up" as const },
  { label: "Conversion", value: "3.24", suffix: "%", change: -2.4, trend: "down" as const },
  { label: "Response Time", value: "145", suffix: "ms" },
];

describe("StatsSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<StatsSection stats={mockStats} />);
      expect(screen.getByText("Active Users")).toBeInTheDocument();
    });

    it("renders all stat labels", () => {
      render(<StatsSection stats={mockStats} />);
      mockStats.forEach((stat) => {
        expect(screen.getByText(stat.label)).toBeInTheDocument();
      });
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <StatsSection stats={mockStats} className="custom-stats" />
      );
      expect(container.firstChild).toHaveClass("custom-stats");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<StatsSection ref={ref} stats={mockStats} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <StatsSection
          stats={mockStats}
          data-testid="stats"
          aria-label="Statistics"
        />
      );
      expect(screen.getByTestId("stats")).toBeInTheDocument();
      expect(screen.getByLabelText("Statistics")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<StatsSection stats={mockStats} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "stats-section"
      );
    });
  });

  describe("header", () => {
    it("renders eyebrow when provided", () => {
      render(<StatsSection stats={mockStats} eyebrow="Metrics" />);
      expect(screen.getByText("Metrics")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <StatsSection stats={mockStats} title="Our Impact" />
      );
      expect(
        screen.getByRole("heading", { level: 2, name: "Our Impact" })
      ).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <StatsSection stats={mockStats} description="Key performance indicators." />
      );
      expect(
        screen.getByText("Key performance indicators.")
      ).toBeInTheDocument();
    });

    it("does not render header when no header props provided", () => {
      const { container } = render(<StatsSection stats={mockStats} />);
      const section = container.firstChild as HTMLElement;
      expect(
        section.querySelector(".text-center.mb-8")
      ).not.toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders cards variant by default using StatCard", () => {
      const { container } = render(<StatsSection stats={mockStats} />);
      const section = container.firstChild as HTMLElement;
      const statCards = section.querySelectorAll('[data-slot="stat-card"]');
      expect(statCards).toHaveLength(mockStats.length);
    });

    it("renders simple variant without StatCard wrappers", () => {
      const { container } = render(
        <StatsSection stats={mockStats} variant="simple" />
      );
      const section = container.firstChild as HTMLElement;
      expect(
        section.querySelector('[data-slot="stat-card"]')
      ).not.toBeInTheDocument();
    });

    it("renders simple variant with value and label text", () => {
      const simpleStats = [
        { label: "Components", value: "100", suffix: "+" },
      ];
      render(<StatsSection stats={simpleStats} variant="simple" />);
      expect(screen.getByText("100+")).toBeInTheDocument();
      expect(screen.getByText("Components")).toBeInTheDocument();
    });

    it("renders simple variant with prefix and suffix", () => {
      const prefixStats = [
        { label: "Revenue", value: "50", prefix: "$", suffix: "M" },
      ];
      render(<StatsSection stats={prefixStats} variant="simple" />);
      expect(screen.getByText("$50M")).toBeInTheDocument();
    });
  });

  describe("columns", () => {
    it("auto-selects 2 columns for 2 stats", () => {
      const twoStats = mockStats.slice(0, 2);
      const { container } = render(<StatsSection stats={twoStats} />);
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("auto-selects 3 columns for 3 stats", () => {
      const threeStats = mockStats.slice(0, 3);
      const { container } = render(<StatsSection stats={threeStats} />);
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("auto-selects 4 columns for 4 stats", () => {
      const { container } = render(<StatsSection stats={mockStats} />);
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });

    it("respects explicit columns prop", () => {
      const { container } = render(
        <StatsSection stats={mockStats} columns={2} />
      );
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
      expect(grid).not.toHaveClass("lg:grid-cols-4");
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<StatsSection stats={mockStats} />);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });
  });
});

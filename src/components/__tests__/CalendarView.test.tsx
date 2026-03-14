import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarView, type CalendarEvent } from "../CalendarView";

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Sprint Planning",
    date: new Date(2026, 2, 10).toISOString(), // March 10, 2026
    color: "blue",
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "2",
    title: "Team Standup",
    date: new Date(2026, 2, 10).toISOString(), // Same day
    color: "green",
    startTime: "09:00",
  },
  {
    id: "3",
    title: "Product Demo",
    date: new Date(2026, 2, 20).toISOString(), // March 20, 2026
    color: "orange",
  },
];

describe("CalendarView", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <CalendarView year={2026} month={2} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      const { container } = render(
        <CalendarView year={2026} month={2} />
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "calendar-view");
    });

    it("applies custom className", () => {
      const { container } = render(
        <CalendarView year={2026} month={2} className="custom" />
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<CalendarView ref={ref} year={2026} month={2} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders month and year title", () => {
      render(<CalendarView year={2026} month={2} />);
      expect(screen.getByText("March 2026")).toBeInTheDocument();
    });

    it("renders day of week headers", () => {
      render(<CalendarView year={2026} month={2} />);
      expect(screen.getByText("Sun")).toBeInTheDocument();
      expect(screen.getByText("Mon")).toBeInTheDocument();
      expect(screen.getByText("Tue")).toBeInTheDocument();
      expect(screen.getByText("Wed")).toBeInTheDocument();
      expect(screen.getByText("Thu")).toBeInTheDocument();
      expect(screen.getByText("Fri")).toBeInTheDocument();
      expect(screen.getByText("Sat")).toBeInTheDocument();
    });

    it("renders days of the month", () => {
      render(<CalendarView year={2026} month={2} />);
      // March 2026 has 31 days
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("31")).toBeInTheDocument();
    });

    it("renders events on the correct dates", () => {
      render(<CalendarView year={2026} month={2} events={sampleEvents} />);
      expect(screen.getByText("Sprint Planning")).toBeInTheDocument();
      expect(screen.getByText("Team Standup")).toBeInTheDocument();
      expect(screen.getByText("Product Demo")).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("renders previous and next month buttons", () => {
      render(<CalendarView year={2026} month={2} />);
      expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next month")).toBeInTheDocument();
    });

    it("calls onMonthChange with previous month", () => {
      const onMonthChange = vi.fn();
      render(
        <CalendarView year={2026} month={2} onMonthChange={onMonthChange} />
      );
      fireEvent.click(screen.getByLabelText("Previous month"));
      expect(onMonthChange).toHaveBeenCalledWith(2026, 1);
    });

    it("calls onMonthChange with next month", () => {
      const onMonthChange = vi.fn();
      render(
        <CalendarView year={2026} month={2} onMonthChange={onMonthChange} />
      );
      fireEvent.click(screen.getByLabelText("Next month"));
      expect(onMonthChange).toHaveBeenCalledWith(2026, 3);
    });

    it("wraps around to December when going back from January", () => {
      const onMonthChange = vi.fn();
      render(
        <CalendarView year={2026} month={0} onMonthChange={onMonthChange} />
      );
      fireEvent.click(screen.getByLabelText("Previous month"));
      expect(onMonthChange).toHaveBeenCalledWith(2025, 11);
    });

    it("wraps around to January when going forward from December", () => {
      const onMonthChange = vi.fn();
      render(
        <CalendarView year={2026} month={11} onMonthChange={onMonthChange} />
      );
      fireEvent.click(screen.getByLabelText("Next month"));
      expect(onMonthChange).toHaveBeenCalledWith(2027, 0);
    });
  });

  describe("interactions", () => {
    it("calls onDateClick when a date is clicked", () => {
      const onDateClick = vi.fn();
      render(
        <CalendarView year={2026} month={2} onDateClick={onDateClick} />
      );
      // Click on day 15
      const day15 = screen.getByText("15");
      fireEvent.click(day15.closest("[role='button']")!);
      expect(onDateClick).toHaveBeenCalledTimes(1);
      const calledDate = onDateClick.mock.calls[0][0];
      expect(calledDate.getDate()).toBe(15);
      expect(calledDate.getMonth()).toBe(2);
      expect(calledDate.getFullYear()).toBe(2026);
    });

    it("calls onEventClick when an event is clicked", () => {
      const onEventClick = vi.fn();
      const onDateClick = vi.fn();
      render(
        <CalendarView
          year={2026}
          month={2}
          events={sampleEvents}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
        />
      );
      fireEvent.click(screen.getByText("Sprint Planning"));
      expect(onEventClick).toHaveBeenCalledWith("1");
      // Should not bubble to date click
      expect(onDateClick).not.toHaveBeenCalled();
    });
  });

  describe("overflow events", () => {
    it("shows +N more when there are more than 3 events", () => {
      const manyEvents: CalendarEvent[] = [
        { id: "1", title: "Event 1", date: new Date(2026, 2, 10).toISOString() },
        { id: "2", title: "Event 2", date: new Date(2026, 2, 10).toISOString() },
        { id: "3", title: "Event 3", date: new Date(2026, 2, 10).toISOString() },
        { id: "4", title: "Event 4", date: new Date(2026, 2, 10).toISOString() },
      ];
      render(
        <CalendarView year={2026} month={2} events={manyEvents} />
      );
      expect(screen.getByText("+1 more")).toBeInTheDocument();
    });
  });

  describe("different months", () => {
    it("renders January correctly", () => {
      render(<CalendarView year={2026} month={0} />);
      expect(screen.getByText("January 2026")).toBeInTheDocument();
    });

    it("renders December correctly", () => {
      render(<CalendarView year={2026} month={11} />);
      expect(screen.getByText("December 2026")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders calendar without events", () => {
      render(<CalendarView year={2026} month={2} events={[]} />);
      expect(screen.getByText("March 2026")).toBeInTheDocument();
      // Day numbers should still be present (may appear multiple times due to prev/next month days)
      expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("event display", () => {
    it("shows event title with tooltip including time", () => {
      const { container } = render(
        <CalendarView year={2026} month={2} events={sampleEvents} />
      );
      const eventEl = container.querySelector("[title='Sprint Planning (10:00 - 11:30)']");
      expect(eventEl).toBeInTheDocument();
    });

    it("shows event title tooltip without time when no startTime", () => {
      const { container } = render(
        <CalendarView year={2026} month={2} events={sampleEvents} />
      );
      const eventEl = container.querySelector("[title='Product Demo']");
      expect(eventEl).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("navigation buttons have aria-labels", () => {
      render(<CalendarView year={2026} month={2} />);
      expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next month")).toBeInTheDocument();
    });
  });
});

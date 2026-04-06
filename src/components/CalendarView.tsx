import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  color?: string;
  startTime?: string;
  endTime?: string;
};

export type CalendarViewProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  year: number;
  month: number;
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (eventId: string) => void;
  onMonthChange?: (year: number, month: number) => void;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventDotColors: Record<string, string> = {
  accent: "bg-accent",
  blue: "bg-blue",
  green: "bg-green",
  yellow: "bg-yellow",
  purple: "bg-purple",
  orange: "bg-orange",
  pink: "bg-pink-400",
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const CalendarView = forwardRef<HTMLDivElement, CalendarViewProps>(
  (
    {
      className,
      year,
      month,
      events = [],
      onDateClick,
      onEventClick,
      onMonthChange,
      ...props
    },
    ref
  ) => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Previous month days to fill the first row
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    // Build the calendar grid
    const calendarDays: { date: Date; currentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // Next month leading days to fill the last row
    const remaining = 7 - (calendarDays.length % 7);
    if (remaining < 7) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      for (let i = 1; i <= remaining; i++) {
        calendarDays.push({
          date: new Date(nextYear, nextMonth, i),
          currentMonth: false,
        });
      }
    }

    const handlePrevMonth = () => {
      if (onMonthChange) {
        const newMonth = month === 0 ? 11 : month - 1;
        const newYear = month === 0 ? year - 1 : year;
        onMonthChange(newYear, newMonth);
      }
    };

    const handleNextMonth = () => {
      if (onMonthChange) {
        const newMonth = month === 11 ? 0 : month + 1;
        const newYear = month === 11 ? year + 1 : year;
        onMonthChange(newYear, newMonth);
      }
    };

    const getEventsForDate = (date: Date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return isSameDay(eventDate, date);
      });
    };

    return (
      <div
        ref={ref}
        data-slot="calendar-view"
        className={cn(
          "rounded-xl border border-border overflow-hidden bg-bg",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text-loud">
            {MONTH_NAMES[month]} {year}
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-fg-200 hover:text-text-loud hover:bg-bg-subtle rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-fg-200 hover:text-text-loud hover:bg-bg-subtle rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 text-center border-b border-border">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-xs text-fg-200 py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = isSameDay(day.date, today);

            return (
              <div
                key={index}
                role={onDateClick ? "button" : undefined}
                tabIndex={onDateClick && day.currentMonth ? 0 : undefined}
                onClick={() => {
                  if (onDateClick && day.currentMonth) {
                    onDateClick(day.date);
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    onDateClick &&
                    day.currentMonth &&
                    (e.key === "Enter" || e.key === " ")
                  ) {
                    e.preventDefault();
                    onDateClick(day.date);
                  }
                }}
                className={cn(
                  "min-h-[80px] border-b border-r border-border p-1",
                  day.currentMonth
                    ? "hover:bg-bg-subtle transition-colors"
                    : "opacity-60",
                  onDateClick && day.currentMonth && "cursor-pointer"
                )}
              >
                {/* Day number */}
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "text-xs inline-flex items-center justify-center",
                      isToday
                        ? "bg-accent-dim text-fg-on-accent rounded-full h-6 w-6 font-medium"
                        : "text-fg-200 h-6 w-6"
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                </div>

                {/* Events */}
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      role={onEventClick && !onDateClick ? "button" : undefined}
                      tabIndex={onEventClick && !onDateClick ? 0 : undefined}
                      onClick={(e) => {
                        if (onEventClick) {
                          e.stopPropagation();
                          onEventClick(event.id);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          onEventClick &&
                          !onDateClick &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          e.stopPropagation();
                          onEventClick(event.id);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1 px-1 rounded text-[10px] truncate",
                        onEventClick && "cursor-pointer hover:bg-bg-subtle"
                      )}
                      title={
                        event.startTime
                          ? `${event.title} (${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""})`
                          : event.title
                      }
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          event.color && eventDotColors[event.color]
                            ? eventDotColors[event.color]
                            : "bg-text-muted"
                        )}
                      />
                      <span className="text-fg-200 truncate">
                        {event.title}
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-fg-200 px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CalendarView.displayName = "CalendarView";

export { CalendarView };

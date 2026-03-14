import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarView, type CalendarEvent } from "./CalendarView";
import { useState } from "react";

const meta: Meta<typeof CalendarView> = {
  title: "Blocks/Application/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof CalendarView>;

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Sprint Planning",
    date: new Date(currentYear, currentMonth, 3).toISOString(),
    color: "blue",
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "2",
    title: "Design Review",
    date: new Date(currentYear, currentMonth, 7).toISOString(),
    color: "purple",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    id: "3",
    title: "Team Standup",
    date: new Date(currentYear, currentMonth, 12).toISOString(),
    color: "green",
    startTime: "09:00",
    endTime: "09:15",
  },
  {
    id: "4",
    title: "Product Demo",
    date: new Date(currentYear, currentMonth, 18).toISOString(),
    color: "orange",
    startTime: "16:00",
    endTime: "17:00",
  },
  {
    id: "5",
    title: "Retrospective",
    date: new Date(currentYear, currentMonth, 24).toISOString(),
    color: "pink",
    startTime: "15:00",
    endTime: "16:00",
  },
];

const manyEvents: CalendarEvent[] = [
  ...sampleEvents,
  {
    id: "6",
    title: "1:1 with Manager",
    date: new Date(currentYear, currentMonth, 7).toISOString(),
    color: "yellow",
    startTime: "11:00",
    endTime: "11:30",
  },
  {
    id: "7",
    title: "Code Review Session",
    date: new Date(currentYear, currentMonth, 7).toISOString(),
    color: "green",
    startTime: "16:00",
    endTime: "17:00",
  },
  {
    id: "8",
    title: "Lunch & Learn",
    date: new Date(currentYear, currentMonth, 7).toISOString(),
    color: "red",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    id: "9",
    title: "Client Call",
    date: new Date(currentYear, currentMonth, 12).toISOString(),
    color: "blue",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    id: "10",
    title: "Architecture Meeting",
    date: new Date(currentYear, currentMonth, 12).toISOString(),
    color: "purple",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "11",
    title: "Deploy v2.5",
    date: new Date(currentYear, currentMonth, 18).toISOString(),
    color: "red",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    id: "12",
    title: "Hackathon Kickoff",
    date: new Date(currentYear, currentMonth, 22).toISOString(),
    color: "yellow",
    startTime: "09:00",
    endTime: "18:00",
  },
];

export const Default: Story = {
  render: (args) => {
    const [viewYear, setViewYear] = useState(args.year);
    const [viewMonth, setViewMonth] = useState(args.month);
    return (
      <div className="p-4">
        <CalendarView
          {...args}
          year={viewYear}
          month={viewMonth}
          onMonthChange={(y, m) => {
            setViewYear(y);
            setViewMonth(m);
          }}
        />
      </div>
    );
  },
  args: {
    year: currentYear,
    month: currentMonth,
    events: sampleEvents,
    onDateClick: (date) => console.log("Date clicked:", date),
    onEventClick: (id) => console.log("Event clicked:", id),
  },
};

export const WithManyEvents: Story = {
  args: {
    year: currentYear,
    month: currentMonth,
    events: manyEvents,
    onEventClick: (id) => console.log("Event clicked:", id),
  },
};

export const Empty: Story = {
  args: {
    year: currentYear,
    month: currentMonth,
    events: [],
  },
};

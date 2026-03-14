import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./DateRangePicker";
import { Field } from "./Field";
import {
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

const meta: Meta<typeof DateRangePicker> = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    numberOfMonths: {
      control: "select",
      options: [1, 2],
    },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px] p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    placeholder: "Select date range",
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

const today = new Date();

const commonPresets = [
  {
    label: "Today",
    range: { from: today, to: today },
  },
  {
    label: "Last 7 days",
    range: { from: subDays(today, 6), to: today },
  },
  {
    label: "Last 30 days",
    range: { from: subDays(today, 29), to: today },
  },
  {
    label: "This month",
    range: { from: startOfMonth(today), to: today },
  },
  {
    label: "Last month",
    range: {
      from: startOfMonth(subMonths(today, 1)),
      to: endOfMonth(subMonths(today, 1)),
    },
  },
  {
    label: "This year",
    range: { from: startOfYear(today), to: today },
  },
];

export const WithPresets: Story = {
  args: {
    label: "Report period",
    presets: commonPresets,
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const SingleCalendar: Story = {
  args: {
    label: "Date range",
    numberOfMonths: 1,
    placeholder: "Pick start and end",
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-72">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const WithLabel: Story = {
  args: {
    label: "Booking dates",
    helperText: "Select your check-in and check-out dates",
    required: true,
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const MinMaxDates: Story = {
  args: {
    label: "Availability",
    helperText: "Only dates within the next 60 days",
    minDate: new Date(),
    maxDate: addDays(new Date(), 60),
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Sprint dates",
    error: true,
    errorMessage: "A valid date range is required",
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked period",
    disabled: true,
    value: {
      from: new Date(2026, 2, 1),
      to: new Date(2026, 2, 14),
    },
  },
  render: function DateRangePickerStory(args) {
    return (
      <div className="w-80">
        <DateRangePicker {...args} />
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    label: "Controlled range",
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({
      from: new Date(2026, 2, 1),
      to: new Date(2026, 2, 14),
    });
    return (
      <div className="flex flex-col gap-4 w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
        <div className="flex gap-2">
          <button
            className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70 hover:bg-white/10"
            onClick={() =>
              setRange({
                from: subDays(new Date(), 6),
                to: new Date(),
              })
            }
          >
            Last 7 days
          </button>
          <button
            className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70 hover:bg-white/10"
            onClick={() => setRange({})}
          >
            Clear
          </button>
        </div>
        <p className="text-xs text-white/40">
          From: {range.from ? range.from.toLocaleDateString() : "none"} | To:{" "}
          {range.to ? range.to.toLocaleDateString() : "none"}
        </p>
      </div>
    );
  },
};

export const CustomFormat: Story = {
  args: {
    label: "Date range (ISO format)",
    dateFormat: "yyyy-MM-dd",
    placeholder: "YYYY-MM-DD",
  },
  render: function DateRangePickerStory(args) {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({
      from: new Date(2026, 2, 1),
      to: new Date(2026, 2, 14),
    });
    return (
      <div className="w-80">
        <DateRangePicker {...args} value={range} onChange={setRange} />
      </div>
    );
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <Field label="Booking dates" description="Select your check-in and check-out dates" required>
          <DateRangePicker placeholder="Select date range" value={range} onChange={setRange} />
        </Field>
      </div>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({});
    return (
      <div className="w-80">
        <Field label="Booking dates" error errorMessage="This field is required.">
          <DateRangePicker placeholder="Select date range" value={range} onChange={setRange} />
        </Field>
      </div>
    );
  },
};

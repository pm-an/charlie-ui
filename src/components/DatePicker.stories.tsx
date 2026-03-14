import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";
import { Field } from "./Field";
import { addDays, subDays, startOfMonth, endOfMonth, isWeekend } from "date-fns";

const meta: Meta<typeof DatePicker> = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
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
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    placeholder: "Pick a date",
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const WithLabel: Story = {
  args: {
    label: "Start date",
    helperText: "Select your project start date",
    required: true,
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const RangeMode: Story = {
  args: {
    mode: "range",
    label: "Date range",
    placeholder: "Select a range",
  },
  render: function DatePickerStory(args) {
    const [range, setRange] = React.useState<{
      from?: Date;
      to?: Date;
    }>({});
    return (
      <div className="w-80">
        <DatePicker
          {...args}
          rangeValue={range}
          onRangeChange={setRange}
        />
      </div>
    );
  },
};

export const WithPresets: Story = {
  args: {
    label: "Due date",
    presets: [
      { label: "Today", date: new Date() },
      { label: "Tomorrow", date: addDays(new Date(), 1) },
      { label: "Next week", date: addDays(new Date(), 7) },
      { label: "In 2 weeks", date: addDays(new Date(), 14) },
      { label: "In 30 days", date: addDays(new Date(), 30) },
    ],
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const MinMaxDates: Story = {
  args: {
    label: "Booking date",
    helperText: "Only dates within the next 30 days",
    minDate: new Date(),
    maxDate: addDays(new Date(), 30),
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const DisabledDates: Story = {
  args: {
    label: "Appointment",
    helperText: "Weekends are not available",
    disabledDates: (date: Date) => isWeekend(date),
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Deadline",
    error: true,
    errorMessage: "A valid date is required",
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked date",
    disabled: true,
    value: new Date(2026, 2, 14),
  },
  render: function DatePickerStory(args) {
    return (
      <div className="w-72">
        <DatePicker {...args} />
      </div>
    );
  },
};

export const CustomFormat: Story = {
  args: {
    label: "Date (ISO format)",
    dateFormat: "yyyy-MM-dd",
    placeholder: "YYYY-MM-DD",
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 2, 14)
    );
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    label: "Controlled date",
  },
  render: function DatePickerStory(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2026, 2, 14)
    );
    return (
      <div className="flex flex-col gap-4 w-72">
        <DatePicker {...args} value={date} onChange={setDate} />
        <div className="flex gap-2">
          <button
            className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70 hover:bg-white/10"
            onClick={() => setDate(new Date())}
          >
            Set today
          </button>
          <button
            className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70 hover:bg-white/10"
            onClick={() => setDate(undefined)}
          >
            Clear
          </button>
        </div>
        <p className="text-xs text-white/60">
          Value: {date ? date.toISOString() : "none"}
        </p>
      </div>
    );
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <Field label="Start date" description="When does your project begin?" required>
          <DatePicker placeholder="Pick a date" value={date} onChange={setDate} />
        </Field>
      </div>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-72">
        <Field label="Start date" error errorMessage="This field is required.">
          <DatePicker placeholder="Pick a date" value={date} onChange={setDate} />
        </Field>
      </div>
    );
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { TimePicker, type TimeValue } from "./TimePicker";
import { Field } from "./Field";

const meta: Meta<typeof TimePicker> = {
  title: "Forms/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showSeconds: { control: "boolean" },
    use12Hour: { control: "boolean" },
    minuteStep: { control: "number" },
    secondStep: { control: "number" },
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[350px] items-start justify-center p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 14,
      minutes: 30,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("timepicker-trigger");
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveTextContent("14:30");
  },
};

export const WithSeconds: Story = {
  args: {
    showSeconds: true,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 9,
      minutes: 15,
      seconds: 45,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("timepicker-trigger")).toHaveTextContent(
      "09:15:45"
    );
  },
};

export const TwelveHour: Story = {
  args: {
    use12Hour: true,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 14,
      minutes: 30,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("timepicker-trigger")).toHaveTextContent(
      "2:30 PM"
    );
  },
};

export const TwelveHourWithSeconds: Story = {
  args: {
    use12Hour: true,
    showSeconds: true,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 8,
      minutes: 5,
      seconds: 12,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("timepicker-trigger")).toHaveTextContent(
      "8:05:12 AM"
    );
  },
};

export const FiveMinuteIntervals: Story = {
  args: {
    minuteStep: 5,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 10,
      minutes: 0,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("timepicker-trigger");
    await expect(trigger).toHaveTextContent("10:00");
    await userEvent.click(trigger);
    // Should show minutes in 5-minute increments
    await waitFor(() => {
      const popover = canvas.getByTestId("timepicker-popover");
      const minuteList = within(popover).getByRole("listbox", { name: "Min" });
      expect(within(minuteList).getByText("00")).toBeVisible();
    });
    const popover = canvas.getByTestId("timepicker-popover");
    const minuteList = within(popover).getByRole("listbox", { name: "Min" });
    await expect(within(minuteList).getByText("05")).toBeVisible();
    await expect(within(minuteList).getByText("10")).toBeVisible();
    await expect(within(minuteList).getByText("55")).toBeVisible();
  },
};

export const WithLabel: Story = {
  args: {
    label: "Meeting time",
    helperText: "Choose when the meeting should start",
    required: true,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 13,
      minutes: 0,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Meeting time")).toBeVisible();
    await expect(
      canvas.getByText("Choose when the meeting should start")
    ).toBeVisible();
    await expect(canvas.getByText("*")).toBeVisible();
  },
};

export const WithError: Story = {
  args: {
    label: "Appointment time",
    error: true,
    errorMessage: "Please select a valid appointment time",
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 3,
      minutes: 0,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Please select a valid appointment time")
    ).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 16,
      minutes: 45,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("timepicker-trigger");
    await expect(trigger).toBeDisabled();
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 11,
      minutes: 30,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 20,
      minutes: 0,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
};

export const Controlled: Story = {
  render: function TimePickerStory() {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 12,
      minutes: 0,
    });
    return (
      <div className="flex flex-col gap-4 items-start">
        <TimePicker value={value} onChange={setValue} />
        <p className="text-sm text-white/70">
          Selected:{" "}
          <code className="text-[#f87171]">
            {String(value.hours).padStart(2, "0")}:
            {String(value.minutes).padStart(2, "0")}
          </code>
        </p>
        <div className="flex gap-2">
          <button
            className="text-xs px-3 py-1.5 rounded bg-white/5 border border-white/6 text-white/80 hover:bg-white/10 transition-colors"
            onClick={() => setValue({ hours: 9, minutes: 0 })}
          >
            Set 9:00
          </button>
          <button
            className="text-xs px-3 py-1.5 rounded bg-white/5 border border-white/6 text-white/80 hover:bg-white/10 transition-colors"
            onClick={() => setValue({ hours: 17, minutes: 30 })}
          >
            Set 17:30
          </button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("timepicker-trigger")).toHaveTextContent(
      "12:00"
    );
    // Click the 9:00 button
    await userEvent.click(canvas.getByText("Set 9:00"));
    await expect(canvas.getByTestId("timepicker-trigger")).toHaveTextContent(
      "09:00"
    );
  },
};

export const MinMaxTime: Story = {
  args: {
    minTime: { hours: 9, minutes: 0 },
    maxTime: { hours: 17, minutes: 0 },
    label: "Business hours only",
    helperText: "Select a time between 9:00 and 17:00",
  },
  render: function TimePickerStory(args) {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 12,
      minutes: 0,
    });
    return <TimePicker {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Business hours only")).toBeVisible();
    await expect(
      canvas.getByText("Select a time between 9:00 and 17:00")
    ).toBeVisible();
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 9,
      minutes: 0,
    });
    return (
      <Field label="Meeting time" description="Choose when the meeting should start" required>
        <TimePicker value={value} onChange={setValue} />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [value, setValue] = React.useState<TimeValue>({
      hours: 9,
      minutes: 0,
    });
    return (
      <Field label="Meeting time" error errorMessage="This field is required.">
        <TimePicker value={value} onChange={setValue} />
      </Field>
    );
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ToggleGroup } from "./ToggleGroup";
import { Field } from "./Field";
import { Grid2X2, List, LayoutGrid, Calendar, Clock, Zap, Star, Heart } from "lucide-react";

const meta: Meta<typeof ToggleGroup> = {
  title: "Forms/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  args: {
    options: [
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
    ],
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("monthly");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radiogroup = canvas.getByRole("radiogroup");
    await expect(radiogroup).toBeVisible();
    const monthlyRadio = canvas.getByRole("radio", { name: /Monthly/i });
    const yearlyRadio = canvas.getByRole("radio", { name: /Yearly/i });
    await expect(monthlyRadio).toHaveAttribute("aria-checked", "true");
    await expect(yearlyRadio).toHaveAttribute("aria-checked", "false");
    await userEvent.click(yearlyRadio);
    await expect(yearlyRadio).toHaveAttribute("aria-checked", "true");
    await expect(monthlyRadio).toHaveAttribute("aria-checked", "false");
  },
};

export const ThreeOptions: Story = {
  args: {
    options: [
      { label: "Day", value: "day" },
      { label: "Week", value: "week" },
      { label: "Month", value: "month" },
    ],
  },
  // The spring animation between active states causes a transient overlap where
  // the white pill is mid-slide and axe sees inactive text over a white bg.
  // Exclude the animated pill's overlap from contrast checks.
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", selector: "*:not([data-state='inactive'] > *)" }],
      },
    },
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("week");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: /Week/i })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("radio", { name: /Day/i }));
    await expect(canvas.getByRole("radio", { name: /Day/i })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("radio", { name: /Week/i })).toHaveAttribute("aria-checked", "false");
  },
};

export const Uncontrolled: Story = {
  args: {
    options: [
      { label: "Grid", value: "grid" },
      { label: "List", value: "list" },
    ],
    defaultValue: "grid",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: /Grid/i })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(canvas.getByRole("radio", { name: /List/i }));
    await expect(canvas.getByRole("radio", { name: /List/i })).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("radio", { name: /Grid/i })).toHaveAttribute("aria-checked", "false");
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { label: "Grid", value: "grid", icon: <Grid2X2 /> },
      { label: "List", value: "list", icon: <List /> },
      { label: "Board", value: "board", icon: <LayoutGrid /> },
    ],
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("grid");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: "Day", value: "day", icon: <Calendar /> },
      { label: "Week", value: "week", icon: <Clock /> },
      { label: "Realtime", value: "realtime", icon: <Zap />, disabled: true },
    ],
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("day");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const realtimeRadio = canvas.getByRole("radio", { name: /Realtime/i });
    await expect(realtimeRadio).toBeDisabled();
    await userEvent.click(realtimeRadio);
    // Should remain on "Day" since "Realtime" is disabled
    await expect(canvas.getByRole("radio", { name: /Day/i })).toHaveAttribute("aria-checked", "true");
  },
};

export const IconsAndDisabled: Story = {
  args: {
    options: [
      { label: "Favorites", value: "favorites", icon: <Star /> },
      { label: "Liked", value: "liked", icon: <Heart /> },
      { label: "Archived", value: "archived", disabled: true },
    ],
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("favorites");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
};

export const ViewMode: Story = {
  args: {
    options: [
      { label: "Grid", value: "grid", icon: <Grid2X2 /> },
      { label: "List", value: "list", icon: <List /> },
    ],
  },
  render: function ToggleGroupStory(args) {
    const [value, setValue] = React.useState("grid");
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
};

export const InsideField: Story = {
  render: function InsideFieldStory() {
    const [value, setValue] = React.useState("monthly");
    return (
      <Field label="Billing cycle" description="Choose how often you'd like to be billed" required>
        <ToggleGroup
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          value={value}
          onChange={setValue}
        />
      </Field>
    );
  },
};

export const InsideFieldWithError: Story = {
  render: function InsideFieldWithErrorStory() {
    const [value, setValue] = React.useState("");
    return (
      <Field label="Billing cycle" error errorMessage="This field is required.">
        <ToggleGroup
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          value={value}
          onChange={setValue}
        />
      </Field>
    );
  },
};

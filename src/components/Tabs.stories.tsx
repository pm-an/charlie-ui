import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["pills", "underline", "segment"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const billingItems = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const navItems = [
  { label: "Overview", value: "overview" },
  { label: "Analytics", value: "analytics" },
  { label: "Settings", value: "settings" },
  { label: "Billing", value: "billing" },
];

const badgeItems = [
  { label: "All", value: "all", badge: "128" },
  { label: "Active", value: "active", badge: "42" },
  { label: "Archived", value: "archived" },
];

export const Pills: Story = {
  args: {
    variant: "pills",
    items: billingItems,
  },
  render: function TabsStory(args) {
    const [value, setValue] = React.useState("monthly");
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole("tablist");
    await expect(tablist).toBeVisible();
    const monthlyTab = canvas.getByRole("tab", { name: "Monthly" });
    const yearlyTab = canvas.getByRole("tab", { name: "Yearly" });
    await expect(monthlyTab).toHaveAttribute("aria-selected", "true");
    await expect(yearlyTab).toHaveAttribute("aria-selected", "false");
    await userEvent.click(yearlyTab);
    await expect(yearlyTab).toHaveAttribute("aria-selected", "true");
    await expect(monthlyTab).toHaveAttribute("aria-selected", "false");
  },
};

export const Underline: Story = {
  args: {
    variant: "underline",
    items: navItems,
  },
  render: function TabsStory(args) {
    const [value, setValue] = React.useState("overview");
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("tab", { name: "Settings" }));
    await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "false");
  },
};

export const Segment: Story = {
  args: {
    variant: "segment",
    items: navItems,
  },
  render: function TabsStory(args) {
    const [value, setValue] = React.useState("overview");
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
};

export const Uncontrolled: Story = {
  args: {
    variant: "pills",
    items: navItems,
    defaultValue: "overview",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("tab", { name: "Analytics" }));
    await expect(canvas.getByRole("tab", { name: "Analytics" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "false");
  },
};

export const WithBadges: Story = {
  args: {
    variant: "pills",
    items: badgeItems,
  },
  render: function TabsStory(args) {
    const [value, setValue] = React.useState("all");
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("128")).toBeVisible();
    await expect(canvas.getByText("42")).toBeVisible();
  },
};

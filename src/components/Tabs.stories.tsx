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
    return (
      <Tabs {...args} value={value} onChange={setValue}>
        <Tabs.Panel value="monthly">
          <div className="p-4 text-white/80">Monthly billing content</div>
        </Tabs.Panel>
        <Tabs.Panel value="yearly">
          <div className="p-4 text-white/80">Yearly billing content</div>
        </Tabs.Panel>
      </Tabs>
    );
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
    return (
      <Tabs {...args} value={value} onChange={setValue}>
        <Tabs.Panel value="overview">
          <div className="p-4 text-white/80">Overview panel content</div>
        </Tabs.Panel>
        <Tabs.Panel value="analytics">
          <div className="p-4 text-white/80">Analytics panel content</div>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <div className="p-4 text-white/80">Settings panel content</div>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <div className="p-4 text-white/80">Billing panel content</div>
        </Tabs.Panel>
      </Tabs>
    );
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
    return (
      <Tabs {...args} value={value} onChange={setValue}>
        <Tabs.Panel value="overview">
          <div className="p-4 text-white/80">Overview panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="analytics">
          <div className="p-4 text-white/80">Analytics panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <div className="p-4 text-white/80">Settings panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <div className="p-4 text-white/80">Billing panel</div>
        </Tabs.Panel>
      </Tabs>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    variant: "pills",
    items: navItems,
    defaultValue: "overview",
  },
  render: function TabsStory(args) {
    return (
      <Tabs {...args}>
        <Tabs.Panel value="overview">
          <div className="p-4 text-white/80">Overview panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="analytics">
          <div className="p-4 text-white/80">Analytics panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <div className="p-4 text-white/80">Settings panel</div>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <div className="p-4 text-white/80">Billing panel</div>
        </Tabs.Panel>
      </Tabs>
    );
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
    return (
      <Tabs {...args} value={value} onChange={setValue}>
        <Tabs.Panel value="all">
          <div className="p-4 text-white/80">All items (128 total)</div>
        </Tabs.Panel>
        <Tabs.Panel value="active">
          <div className="p-4 text-white/80">Active items (42 total)</div>
        </Tabs.Panel>
        <Tabs.Panel value="archived">
          <div className="p-4 text-white/80">Archived items</div>
        </Tabs.Panel>
      </Tabs>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("128")).toBeVisible();
    await expect(canvas.getByText("42")).toBeVisible();
  },
};

export const WithPanels: Story = {
  render: function TabsWithPanelsStory() {
    const [value, setValue] = React.useState("overview");
    const items = [
      { label: "Overview", value: "overview" },
      { label: "Features", value: "features" },
      { label: "Pricing", value: "pricing" },
    ];
    return (
      <Tabs items={items} value={value} onChange={setValue} variant="underline">
        <Tabs.Panel value="overview">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
            <p className="text-white/60">
              A comprehensive overview of the product features and capabilities.
            </p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="features">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Features</h3>
            <ul className="list-disc list-inside text-white/60 space-y-1">
              <li>Responsive design</li>
              <li>Dark mode support</li>
              <li>Accessible components</li>
            </ul>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="pricing">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Pricing</h3>
            <p className="text-white/60">
              Flexible pricing plans for teams of all sizes.
            </p>
          </div>
        </Tabs.Panel>
      </Tabs>
    );
  },
};

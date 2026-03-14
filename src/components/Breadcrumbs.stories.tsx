import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Home, Settings, FileText } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item active>Wireless Headphones</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Home")).toBeVisible();
    await expect(canvas.getByText("Products")).toBeVisible();
    await expect(canvas.getByText("Wireless Headphones")).toBeVisible();
    await expect(canvas.getByLabelText("Breadcrumb")).toBeVisible();
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item href="/" icon={<Home className="h-3.5 w-3.5" />}>
        Home
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href="/settings" icon={<Settings className="h-3.5 w-3.5" />}>
        Settings
      </Breadcrumbs.Item>
      <Breadcrumbs.Item active icon={<FileText className="h-3.5 w-3.5" />}>
        Profile
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Home")).toBeVisible();
    await expect(canvas.getByText("Settings")).toBeVisible();
    await expect(canvas.getByText("Profile")).toBeVisible();
  },
};

export const WithCustomSeparator: Story = {
  render: (args) => (
    <Breadcrumbs {...args} separator={<span>/</span>}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/docs">Documentation</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/docs/components">Components</Breadcrumbs.Item>
      <Breadcrumbs.Item active>Button</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separators = canvas.getAllByText("/");
    await expect(separators.length).toBe(3);
  },
};

export const Collapsed: Story = {
  render: (args) => (
    <Breadcrumbs {...args} maxItems={3}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/electronics">Electronics</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/electronics/audio">Audio</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/electronics/audio/headphones">
        Headphones
      </Breadcrumbs.Item>
      <Breadcrumbs.Item active>Sony WH-1000XM5</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // First item visible
    await expect(canvas.getByText("Home")).toBeVisible();
    // Last 2 items visible
    await expect(canvas.getByText("Headphones")).toBeVisible();
    await expect(canvas.getByText("Sony WH-1000XM5")).toBeVisible();
    // Middle items should NOT be visible
    expect(canvas.queryByText("Products")).toBeNull();
    expect(canvas.queryByText("Electronics")).toBeNull();
    expect(canvas.queryByText("Audio")).toBeNull();
  },
};

export const SingleItem: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item active>Dashboard</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Dashboard")).toBeVisible();
  },
};

export const TwoItems: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item active>Dashboard</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

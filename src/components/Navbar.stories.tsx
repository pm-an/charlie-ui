import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Navbar } from "./Navbar";
import { Button } from "./Button";

const meta: Meta<typeof Navbar> = {
  title: "Layout/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    logo: (
      <span className="text-white font-bold text-lg tracking-tight">
        Charlie UI
      </span>
    ),
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#docs" },
      { label: "Blog", href: "#blog" },
      { label: "Changelog", href: "#changelog" },
    ],
    actions: (
      <Button variant="primary" size="sm">
        Get Started
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Charlie UI")).toBeVisible();
    await expect(canvas.getByRole("navigation")).toBeVisible();
    // Mobile menu toggle exists in DOM (hidden at desktop widths via md:hidden)
    const menuButton = canvas.getByLabelText("Open menu");
    await expect(menuButton).toBeInTheDocument();
  },
};

export const WithCurrentPath: Story = {
  args: {
    logo: (
      <span className="text-white font-bold text-lg tracking-tight">
        Charlie UI
      </span>
    ),
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
    ],
    currentPath: "/features",
    actions: (
      <Button variant="primary" size="sm">
        Get Started
      </Button>
    ),
  },
};

export const WithBadge: Story = {
  args: {
    logo: (
      <span className="text-white font-bold text-lg tracking-tight">
        Charlie UI
      </span>
    ),
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#docs" },
      { label: "Changelog", href: "#changelog", badge: "New" },
      { label: "Blog", href: "#blog" },
    ],
    actions: (
      <Button variant="primary" size="sm">
        Get Started
      </Button>
    ),
  },
};

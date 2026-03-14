import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Footer>;

const defaultColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#api" },
      { label: "Guides", href: "#guides" },
      { label: "Examples", href: "#examples", external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "https://discord.gg", external: true },
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Twitter", href: "https://twitter.com", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
];

const logo = (
  <span className="text-white font-bold text-lg tracking-tight">
    Charlie UI
  </span>
);

export const Default: Story = {
  args: {
    logo,
    columns: defaultColumns,
  },
};

export const WithBottom: Story = {
  args: {
    logo,
    columns: defaultColumns,
    bottom: (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Charlie UI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-white/60 transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white/60 transition-colors">
            Terms
          </a>
        </div>
      </div>
    ),
  },
};

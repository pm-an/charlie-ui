import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "./Section";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Section>;

const placeholderContent = (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {["Analytics", "Automation", "Security"].map((label) => (
      <div
        key={label}
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6"
      >
        <h3 className="text-white font-semibold mb-2 text-base">{label}</h3>
        <p className="text-white/70 text-sm">
          A brief description of the {label.toLowerCase()} feature and why it
          matters for your workflow.
        </p>
      </div>
    ))}
  </div>
);

export const Default: Story = {
  args: {
    eyebrow: "Features",
    title: "Everything you need to ship faster",
    description:
      "A comprehensive toolkit designed for modern product teams. Build, iterate, and deploy with confidence.",
    children: placeholderContent,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    eyebrow: "Features",
    title: "Compact section",
    description: "A smaller section with tighter vertical spacing.",
    children: placeholderContent,
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    eyebrow: "Features",
    title: "Medium section",
    description: "The default section size with balanced spacing.",
    children: placeholderContent,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    eyebrow: "Features",
    title: "Large section",
    description: "A spacious section with generous vertical padding.",
    children: placeholderContent,
  },
};

export const LeftAligned: Story = {
  args: {
    align: "left",
    eyebrow: "Why Charlie UI",
    title: "Built for dark interfaces",
    description:
      "Every component is designed dark-first, so you never have to fight default styles or invert colors.",
    children: placeholderContent,
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    eyebrow: "Platform",
    title: "One library, every surface",
    description:
      "From landing pages to dashboards, Charlie UI covers every layout pattern you need.",
    children: placeholderContent,
  },
};

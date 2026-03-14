import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "./Hero";
import { Button } from "./Button";

const meta: Meta<typeof Hero> = {
  title: "Layout/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Hero>;

export const Centered: Story = {
  args: {
    variant: "centered",
    eyebrow: "Introducing Charlie UI",
    title: "Build faster",
    description:
      "A modern React component library with dark-first design, fluid animations, and full TypeScript support. Ship polished interfaces in minutes, not days.",
    actions: (
      <>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="secondary" size="lg">
          View Components
        </Button>
      </>
    ),
  },
};

export const WithGradient: Story = {
  args: {
    variant: "centered",
    gradient: true,
    eyebrow: "Now in Beta",
    title: "Build faster",
    description:
      "A modern React component library with dark-first design, fluid animations, and full TypeScript support. Ship polished interfaces in minutes, not days.",
    actions: (
      <>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="secondary" size="lg">
          Documentation
        </Button>
      </>
    ),
  },
};

export const Split: Story = {
  args: {
    variant: "split",
    eyebrow: "For Developers",
    title: "Build faster",
    description:
      "Drop-in components that look great out of the box. Fully typed, accessible, and designed for dark interfaces.",
    actions: (
      <>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="ghost" size="lg">
          Learn More
        </Button>
      </>
    ),
    children: (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-8 flex items-center justify-center min-h-[300px]">
        <span className="text-white/60 text-sm">Media or illustration</span>
      </div>
    ),
  },
};

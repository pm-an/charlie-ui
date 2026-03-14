import type { Meta, StoryObj } from "@storybook/react-vite";
import { CTASection } from "./CTASection";
import { Button } from "./Button";

const meta: Meta<typeof CTASection> = {
  title: "Blocks/Marketing/CTASection",
  component: CTASection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {
  args: {
    title: "Start building with Charlie UI today",
    description:
      "Join thousands of developers shipping polished interfaces faster. Get started with our free tier and upgrade as you grow.",
    actions: (
      <>
        <Button variant="primary" size="lg">
          Get Started Free
        </Button>
        <Button variant="secondary" size="lg">
          View Documentation
        </Button>
      </>
    ),
  },
};

export const WithGradient: Story = {
  args: {
    variant: "gradient",
    title: "Ready to transform your workflow?",
    description:
      "Ship production-ready UIs in hours, not weeks. Dark-first design, full TypeScript support, and 100+ components out of the box.",
    actions: (
      <>
        <Button variant="primary" size="lg">
          Start Free Trial
        </Button>
        <Button variant="secondary" size="lg">
          Talk to Sales
        </Button>
      </>
    ),
  },
};

export const Split: Story = {
  args: {
    variant: "split",
    title: "Ship faster with Charlie UI",
    description:
      "Beautiful dark-first components, designed for modern applications. Fully accessible and responsive out of the box.",
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
  },
};

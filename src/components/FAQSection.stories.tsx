import type { Meta, StoryObj } from "@storybook/react-vite";
import { FAQSection } from "./FAQSection";

const meta: Meta<typeof FAQSection> = {
  title: "Blocks/Marketing/FAQSection",
  component: FAQSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof FAQSection>;

const faqItems = [
  {
    question: "What is Charlie UI?",
    answer:
      "Charlie UI is a modern React component library with dark-first design, fluid animations, and full TypeScript support. It provides over 100 production-ready components for building polished interfaces.",
  },
  {
    question: "Is Charlie UI free to use?",
    answer:
      "Yes, Charlie UI is open source and free for both personal and commercial use under the MIT license. You can use it in any project without restrictions.",
  },
  {
    question: "Does it support server-side rendering?",
    answer:
      "Charlie UI components are designed to work with React 19 and support both client and server rendering. Components that require client-side interactivity are marked with the 'use client' directive.",
  },
  {
    question: "How do I customize the theme?",
    answer:
      "You can customize Charlie UI using CSS custom properties (--charlie-* tokens). Wrap your app in a ThemeProvider and choose from 7 preset themes, or override individual tokens for a fully custom look.",
  },
  {
    question: "Can I use individual components?",
    answer:
      "Yes, Charlie UI supports tree-shaking so you only bundle the components you actually use. Import individual components directly from the package.",
  },
  {
    question: "What browsers are supported?",
    answer:
      "Charlie UI supports all modern browsers including Chrome, Firefox, Safari, and Edge. We target the last 2 versions of each major browser.",
  },
];

export const Default: Story = {
  args: {
    items: faqItems.slice(0, 4),
  },
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    items: faqItems,
  },
};

export const WithHeader: Story = {
  args: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    description:
      "Everything you need to know about Charlie UI. Can't find what you're looking for? Reach out to our support team.",
    items: faqItems,
  },
};

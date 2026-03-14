import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogSection } from "./BlogSection";

const meta: Meta<typeof BlogSection> = {
  title: "Blocks/Marketing/BlogSection",
  component: BlogSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof BlogSection>;

const sixPosts = [
  {
    title: "Announcing Charlie UI 2.0: Faster, Smarter, More Flexible",
    excerpt:
      "After six months of development, we are thrilled to release Charlie UI 2.0 with a completely rewritten animation engine, 40% smaller bundle, and 30 new components.",
    date: "March 12, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Charlie+UI+2.0",
    tag: "Release",
    href: "#",
  },
  {
    title: "Building Accessible Dark Interfaces: Lessons from the Trenches",
    excerpt:
      "Dark mode is more than inverting colors. We share the contrast ratios, focus indicators, and ARIA patterns that make dark UIs truly accessible.",
    date: "March 5, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Accessibility",
    tag: "Engineering",
    href: "#",
  },
  {
    title: "How We Reduced Our Bundle Size by 40% with Tree Shaking",
    excerpt:
      "A deep dive into our build pipeline overhaul: from barrel exports to direct imports, and the tooling decisions that made it possible.",
    date: "February 28, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Performance",
    tag: "Performance",
    href: "#",
  },
  {
    title: "Design Tokens at Scale: Managing Themes Across 100+ Components",
    excerpt:
      "Our approach to CSS custom properties, theme composition, and runtime switching that powers Charlie UI's seven built-in themes.",
    date: "February 20, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Design+Tokens",
    tag: "Design",
    href: "#",
  },
  {
    title: "From Figma to React: Automating the Component Pipeline",
    excerpt:
      "How we use Figma's API and custom code generation to keep our component library perfectly in sync with design, eliminating drift entirely.",
    date: "February 12, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Figma+Pipeline",
    tag: "Tooling",
    href: "#",
  },
  {
    title: "Testing UI Components: Our Strategy for 95% Coverage",
    excerpt:
      "A practical guide to testing React components with Vitest and Testing Library, covering unit tests, interaction tests, and visual regression.",
    date: "February 5, 2026",
    image: "https://placehold.co/800x450/1a1a2e/ffffff?text=Testing",
    tag: "Quality",
    href: "#",
  },
];

export const Default: Story = {
  args: {
    eyebrow: "Blog",
    title: "Latest from the team",
    description:
      "Engineering insights, product updates, and design deep-dives from the Charlie UI team.",
    posts: sixPosts,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    eyebrow: "Updates",
    title: "Recent articles",
    description: "Stay up to date with the latest from our engineering blog.",
    posts: sixPosts.slice(0, 4),
    columns: 2,
  },
};

export const WithViewAll: Story = {
  args: {
    eyebrow: "Blog",
    title: "From our blog",
    description:
      "The latest articles on design systems, performance, and developer experience.",
    posts: sixPosts.slice(0, 3),
    columns: 3,
    viewAllHref: "/blog",
    viewAllLabel: "View all posts",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogCard } from "./BlogCard";

const meta: Meta<typeof BlogCard> = {
  title: "Cards/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof BlogCard>;

export const Default: Story = {
  args: {
    title: "Introducing Charlie UI v0.1",
    excerpt:
      "A new dark-themed component library built for modern React apps. Learn how we designed it from the ground up with accessibility and performance in mind.",
    date: "March 10, 2026",
  },
};

export const WithImage: Story = {
  args: {
    title: "Building Accessible Dark Interfaces",
    excerpt:
      "Dark themes are more than inverting colours. We explore contrast ratios, focus indicators, and design patterns that make dark UIs truly accessible.",
    date: "February 28, 2026",
    image: "https://picsum.photos/seed/blog1/600/300",
  },
};

export const WithTag: Story = {
  args: {
    title: "Design Tokens and Theming Strategy",
    excerpt:
      "How CSS custom properties power Charlie UI's theming system and enable runtime theme switching without a build step.",
    date: "February 15, 2026",
    tag: "Engineering",
    image: "https://picsum.photos/seed/blog2/600/300",
  },
};

export const BlogGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <BlogCard
        title="Introducing Charlie UI v0.1"
        excerpt="A new dark-themed component library built for modern React apps with accessibility and performance at the forefront."
        date="March 10, 2026"
        image="https://picsum.photos/seed/grid1/600/300"
        tag="Announcement"
      />
      <BlogCard
        title="Building Accessible Dark Interfaces"
        excerpt="Dark themes are more than inverting colours. We explore contrast ratios, focus indicators, and design patterns."
        date="February 28, 2026"
        image="https://picsum.photos/seed/grid2/600/300"
        tag="Design"
      />
      <BlogCard
        title="Design Tokens and Theming Strategy"
        excerpt="How CSS custom properties power Charlie UI's theming system and enable runtime theme switching."
        date="February 15, 2026"
        image="https://picsum.photos/seed/grid3/600/300"
        tag="Engineering"
      />
    </div>
  ),
};

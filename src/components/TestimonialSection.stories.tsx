import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialSection } from "./TestimonialSection";

const meta: Meta<typeof TestimonialSection> = {
  title: "Blocks/Marketing/TestimonialSection",
  component: TestimonialSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TestimonialSection>;

const sixTestimonials = [
  {
    quote:
      "We migrated our entire frontend to Charlie UI in a weekend. The dark-first approach meant zero rework on our existing design system.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "Nextera",
    avatar: "https://i.pravatar.cc/80?u=sarah",
  },
  {
    quote:
      "The component quality is outstanding. Every edge case we threw at it was already handled. Our QA cycle dropped from two weeks to three days.",
    author: "Marcus Johnson",
    role: "Lead Developer",
    company: "Arclight",
    avatar: "https://i.pravatar.cc/80?u=marcus",
  },
  {
    quote:
      "I've tried a dozen component libraries. Charlie UI is the first one where I didn't have to fight the defaults to get a professional result.",
    author: "Emily Rodriguez",
    role: "Design Engineer",
    company: "Pylon",
    avatar: "https://i.pravatar.cc/80?u=emily",
  },
  {
    quote:
      "Our accessibility audit went from 47 issues to zero after switching. Every component ships with proper ARIA attributes out of the box.",
    author: "David Park",
    role: "Frontend Architect",
    company: "Luminary",
    avatar: "https://i.pravatar.cc/80?u=david",
  },
  {
    quote:
      "The Storybook integration is chef's kiss. Our designers can browse components, tweak props, and copy code without leaving the browser.",
    author: "Priya Sharma",
    role: "Product Designer",
    company: "Meridian",
    avatar: "https://i.pravatar.cc/80?u=priya",
  },
  {
    quote:
      "Performance is remarkable. We saw a 40% reduction in bundle size after replacing our custom components with Charlie UI equivalents.",
    author: "James Wilson",
    role: "Staff Engineer",
    company: "Vertex",
    avatar: "https://i.pravatar.cc/80?u=james",
  },
];

export const Grid: Story = {
  args: {
    eyebrow: "Testimonials",
    title: "Loved by engineering teams",
    description:
      "Hear from the developers and designers who ship faster with Charlie UI.",
    testimonials: sixTestimonials,
    variant: "grid",
    columns: 3,
  },
};

export const Featured: Story = {
  args: {
    eyebrow: "What people say",
    title: "Trusted by thousands",
    description:
      "From startups to enterprises, teams rely on Charlie UI every day.",
    testimonials: sixTestimonials.slice(0, 3),
    variant: "featured",
  },
};

export const TwoColumns: Story = {
  args: {
    eyebrow: "Reviews",
    title: "Developer feedback",
    description: "What our community has to say about working with Charlie UI.",
    testimonials: sixTestimonials.slice(0, 4),
    variant: "grid",
    columns: 2,
  },
};

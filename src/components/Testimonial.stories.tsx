import type { Meta, StoryObj } from "@storybook/react-vite";
import { Testimonial } from "./Testimonial";

const meta: Meta<typeof Testimonial> = {
  title: "Cards/Testimonial",
  component: Testimonial,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Testimonial>;

export const Default: Story = {
  args: {
    quote:
      "Charlie UI cut our development time in half. The components are polished, consistent, and a joy to work with. We shipped our new dashboard two weeks ahead of schedule.",
    author: "Sarah Chen",
    role: "Head of Engineering",
    company: "Arclight",
  },
};

export const WithAvatar: Story = {
  args: {
    quote:
      "The dark theme is stunning and the attention to detail is remarkable. Our design team was impressed by how closely the components match our Figma specs right out of the box.",
    author: "Marcus Rivera",
    role: "Senior Product Designer",
    company: "Neonwave",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
};

export const TestimonialGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Testimonial
        quote="Charlie UI cut our development time in half. The components are polished, consistent, and a joy to work with. We shipped our new dashboard two weeks ahead of schedule."
        author="Sarah Chen"
        role="Head of Engineering"
        company="Arclight"
        avatar="https://i.pravatar.cc/150?u=sarah"
      />
      <Testimonial
        quote="The dark theme is stunning and the attention to detail is remarkable. Our design team was impressed by how closely the components match our Figma specs."
        author="Marcus Rivera"
        role="Senior Product Designer"
        company="Neonwave"
        avatar="https://i.pravatar.cc/150?u=marcus"
      />
    </div>
  ),
};

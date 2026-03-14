import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileSection } from "./ProfileSection";

const meta: Meta<typeof ProfileSection> = {
  title: "Blocks/Application/ProfileSection",
  component: ProfileSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ProfileSection>;

export const Default: Story = {
  args: {
    name: "Jane Doe",
    role: "Senior Product Designer",
    bio: "Designing user experiences that bridge the gap between complexity and simplicity. Previously at Stripe, Figma, and Linear.",
  },
};

export const WithCoverImage: Story = {
  args: {
    name: "Alex Rivera",
    role: "Engineering Lead",
    bio: "Building developer tools and infrastructure. Open source enthusiast and conference speaker.",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  },
};

export const WithStats: Story = {
  args: {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    bio: "JavaScript enthusiast. Building the future of web development one component at a time.",
    stats: [
      { label: "Projects", value: 42 },
      { label: "Followers", value: "1.2k" },
      { label: "Following", value: 318 },
      { label: "Stars", value: "8.5k" },
    ],
  },
};

export const WithActions: Story = {
  args: {
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    bio: "Infrastructure as code advocate. Kubernetes, Terraform, and everything in between.",
    stats: [
      { label: "Deployments", value: "2,847" },
      { label: "Uptime", value: "99.9%" },
    ],
    actions: (
      <>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-[#18191a] bg-white/80 hover:bg-white rounded-md transition-colors"
        >
          Follow
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white border border-white/10 hover:border-white/20 rounded-md transition-colors"
        >
          Message
        </button>
      </>
    ),
  },
};

export const Minimal: Story = {
  args: {
    name: "Kim Taylor",
  },
};

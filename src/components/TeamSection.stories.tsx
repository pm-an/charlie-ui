import type { Meta, StoryObj } from "@storybook/react-vite";
import { TeamSection } from "./TeamSection";
import type { TeamMember } from "./TeamSection";

const meta: Meta<typeof TeamSection> = {
  title: "Blocks/Marketing/TeamSection",
  component: TeamSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TeamSection>;

const baseMembers: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    socials: [
      { platform: "Twitter", href: "https://twitter.com/sarachen" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/sarachen" },
    ],
  },
  {
    name: "Marcus Rivera",
    role: "CTO",
    socials: [
      { platform: "GitHub", href: "https://github.com/marcusrivera" },
      { platform: "Twitter", href: "https://twitter.com/marcusrivera" },
    ],
  },
  {
    name: "Emily Zhang",
    role: "Head of Design",
    socials: [
      { platform: "Dribbble", href: "https://dribbble.com/emilyzhang" },
      { platform: "Twitter", href: "https://twitter.com/emilyzhang" },
    ],
  },
  {
    name: "James Okafor",
    role: "Lead Engineer",
    socials: [
      { platform: "GitHub", href: "https://github.com/jamesokafor" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/jamesokafor" },
    ],
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    socials: [
      { platform: "LinkedIn", href: "https://linkedin.com/in/priyasharma" },
      { platform: "Twitter", href: "https://twitter.com/priyasharma" },
    ],
  },
  {
    name: "Alex Kim",
    role: "DevOps Engineer",
    socials: [
      { platform: "GitHub", href: "https://github.com/alexkim" },
    ],
  },
];

export const Default: Story = {
  args: {
    eyebrow: "Our Team",
    title: "Meet the people behind the product",
    description:
      "A diverse group of builders, designers, and thinkers dedicated to creating tools that developers love.",
    members: baseMembers,
    columns: 3,
  },
};

const eightMembers: TeamMember[] = [
  ...baseMembers,
  {
    name: "Olivia Park",
    role: "Marketing Lead",
    socials: [
      { platform: "Twitter", href: "https://twitter.com/oliviapark" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/oliviapark" },
    ],
  },
  {
    name: "Daniel Nguyen",
    role: "Frontend Engineer",
    socials: [
      { platform: "GitHub", href: "https://github.com/danielnguyen" },
    ],
  },
];

export const FourColumns: Story = {
  args: {
    eyebrow: "Our Team",
    title: "The crew that makes it happen",
    description:
      "Engineers, designers, and operators working together to ship great software.",
    members: eightMembers,
    columns: 4,
  },
};

const membersWithBios: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Previously VP of Engineering at Stripe. Passionate about developer tools and building products that scale.",
    socials: [
      { platform: "Twitter", href: "https://twitter.com/sarachen" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/sarachen" },
    ],
  },
  {
    name: "Marcus Rivera",
    role: "CTO",
    bio: "Open source contributor and distributed systems enthusiast. Former tech lead at Vercel.",
    socials: [
      { platform: "GitHub", href: "https://github.com/marcusrivera" },
      { platform: "Twitter", href: "https://twitter.com/marcusrivera" },
    ],
  },
  {
    name: "Emily Zhang",
    role: "Head of Design",
    bio: "Design systems advocate with 10+ years of experience. Previously at Figma and Linear.",
    socials: [
      { platform: "Dribbble", href: "https://dribbble.com/emilyzhang" },
      { platform: "Twitter", href: "https://twitter.com/emilyzhang" },
    ],
  },
  {
    name: "James Okafor",
    role: "Lead Engineer",
    bio: "Full-stack engineer focused on performance and accessibility. Rust and TypeScript enthusiast.",
    socials: [
      { platform: "GitHub", href: "https://github.com/jamesokafor" },
      { platform: "LinkedIn", href: "https://linkedin.com/in/jamesokafor" },
    ],
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    bio: "Product-minded engineer turned PM. Loves talking to users and shipping features that matter.",
    socials: [
      { platform: "LinkedIn", href: "https://linkedin.com/in/priyasharma" },
    ],
  },
  {
    name: "Alex Kim",
    role: "DevOps Engineer",
    bio: "Infrastructure nerd who automates everything. Kubernetes, Terraform, and CI/CD pipelines.",
    socials: [
      { platform: "GitHub", href: "https://github.com/alexkim" },
    ],
  },
];

export const WithBios: Story = {
  args: {
    eyebrow: "Who We Are",
    title: "Built by passionate engineers",
    description:
      "Get to know the talented individuals who bring our vision to life every day.",
    members: membersWithBios,
    columns: 3,
  },
};

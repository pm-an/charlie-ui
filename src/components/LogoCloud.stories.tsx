import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoCloud } from "./LogoCloud";

const meta: Meta<typeof LogoCloud> = {
  title: "Blocks/Marketing/LogoCloud",
  component: LogoCloud,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof LogoCloud>;

const placeholderLogo = (name: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" fill="none"><rect width="120" height="40" rx="4" fill="%23333"/><text x="60" y="24" text-anchor="middle" fill="%23999" font-family="system-ui" font-size="14">${name}</text></svg>`
  )}`;

const logos = [
  { src: placeholderLogo("Vercel"), alt: "Vercel" },
  { src: placeholderLogo("Stripe"), alt: "Stripe", href: "https://stripe.com" },
  { src: placeholderLogo("GitHub"), alt: "GitHub" },
  { src: placeholderLogo("Figma"), alt: "Figma" },
  { src: placeholderLogo("Linear"), alt: "Linear" },
  { src: placeholderLogo("Notion"), alt: "Notion" },
];

export const Default: Story = {
  args: {
    eyebrow: "Trusted by",
    title: "Used by the world's best teams",
    logos,
  },
};

export const Inline: Story = {
  args: {
    eyebrow: "Trusted by industry leaders",
    variant: "inline",
    logos,
  },
};

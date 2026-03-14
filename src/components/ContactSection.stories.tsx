import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactSection } from "./ContactSection";
import { Mail, Phone, MapPin } from "lucide-react";

const meta: Meta<typeof ContactSection> = {
  title: "Blocks/Marketing/ContactSection",
  component: ContactSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {
  args: {
    eyebrow: "Contact Us",
    title: "Get in touch",
    description:
      "Have a question or want to work together? Fill out the form and we will get back to you within 24 hours.",
    variant: "split",
    info: [
      {
        icon: <Mail className="h-5 w-5" />,
        label: "Email",
        value: "hello@charlieui.com",
        href: "mailto:hello@charlieui.com",
      },
      {
        icon: <Phone className="h-5 w-5" />,
        label: "Phone",
        value: "+1 (555) 123-4567",
        href: "tel:+15551234567",
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        label: "Office",
        value: "123 Design Street, San Francisco, CA 94102",
      },
    ],
    onSubmit: (data) => {
      console.log("Form submitted:", data);
    },
  },
};

export const Simple: Story = {
  args: {
    eyebrow: "Reach Out",
    title: "Send us a message",
    description:
      "We would love to hear from you. Drop us a line and we will respond as soon as possible.",
    variant: "simple",
    onSubmit: (data) => {
      console.log("Form submitted:", data);
    },
  },
};

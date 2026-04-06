import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { FileText, Search, ShoppingCart, Users } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Blocks/Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-bg p-8 md:p-12 max-w-lg mx-auto">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No items yet",
    description: "Get started by creating your first item.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No documents",
    description: "Create a document to start collaborating with your team.",
    icon: <FileText className="h-full w-full" />,
    action: (
      <Button variant="primary" size="sm">
        Create document
      </Button>
    ),
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "No results found",
    description: "Try adjusting your search or filters.",
    icon: <Search className="h-full w-full" />,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "Your cart is empty",
    description: "Browse our products and add items to your cart to get started.",
    icon: <ShoppingCart className="h-full w-full" />,
    action: (
      <Button variant="primary" size="lg">
        Browse products
      </Button>
    ),
  },
};

export const CustomIcon: Story = {
  args: {
    title: "No team members",
    description: "Invite people to start collaborating on this project.",
    icon: <Users className="h-full w-full" />,
    action: (
      <Button variant="secondary" size="sm">
        Invite members
      </Button>
    ),
  },
};

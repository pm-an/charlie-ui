import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "busy"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=1",
    alt: "Piotr Michalik",
  },
};

export const WithFallback: Story = {
  args: {
    alt: "Piotr Michalik",
    fallback: "PM",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="xs" src="https://i.pravatar.cc/150?u=1" alt="Extra small" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=2" alt="Small" />
      <Avatar size="md" src="https://i.pravatar.cc/150?u=3" alt="Medium" />
      <Avatar size="lg" src="https://i.pravatar.cc/150?u=4" alt="Large" />
      <Avatar size="xl" src="https://i.pravatar.cc/150?u=5" alt="Extra large" />
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://i.pravatar.cc/150?u=6"
        alt="Online user"
        status="online"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=7"
        alt="Offline user"
        status="offline"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=8"
        alt="Busy user"
        status="busy"
      />
    </div>
  ),
};

export const FallbackWithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="Alice Brown" fallback="AB" status="online" />
      <Avatar alt="Charlie Davis" fallback="CD" status="offline" />
      <Avatar alt="Emma Fox" fallback="EF" status="busy" />
    </div>
  ),
};

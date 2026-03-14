import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup } from "./AvatarGroup";
import { Avatar } from "./Avatar";

const meta: Meta<typeof AvatarGroup> = {
  title: "Data Display/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=10" alt="Alice" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=11" alt="Bob" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=12" alt="Charlie" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=13" alt="Diana" />
    </AvatarGroup>
  ),
};

export const WithMax: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=20" alt="Alice" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=21" alt="Bob" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=22" alt="Charlie" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=23" alt="Diana" />
      <Avatar size="sm" src="https://i.pravatar.cc/150?u=24" alt="Eve" />
    </AvatarGroup>
  ),
};

export const WithFallbacks: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar size="sm" alt="Alice Brown" fallback="AB" />
      <Avatar size="sm" alt="Charlie Davis" fallback="CD" />
      <Avatar size="sm" alt="Emma Fox" fallback="EF" />
    </AvatarGroup>
  ),
};

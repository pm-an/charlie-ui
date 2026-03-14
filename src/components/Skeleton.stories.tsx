import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circle", "rect"],
    },
    width: { control: "text" },
    height: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: "text",
    width: "240px",
  },
};

export const Circle: Story = {
  args: {
    variant: "circle",
    width: 48,
    height: 48,
  },
};

export const Rect: Story = {
  args: {
    variant: "rect",
    width: "100%",
    height: 120,
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-white/6 max-w-sm">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rect" width="100%" height={120} />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Container>;

export const Small: Story = {
  args: {
    size: "sm",
    className: "py-12",
    children: (
      <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
        <p className="text-white/60 text-sm">
          Small container — max-width: 746px
        </p>
      </div>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    className: "py-12",
    children: (
      <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
        <p className="text-white/60 text-sm">
          Medium container — max-width: 960px
        </p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    className: "py-12",
    children: (
      <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
        <p className="text-white/60 text-sm">
          Large container — max-width: 1080px
        </p>
      </div>
    ),
  },
};

export const XL: Story = {
  args: {
    size: "xl",
    className: "py-12",
    children: (
      <div className="border border-dashed border-white/20 rounded-lg p-6 text-center">
        <p className="text-white/60 text-sm">
          XL container — max-width: 1280px
        </p>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { GradientBackground } from "./GradientBackground";

const meta: Meta<typeof GradientBackground> = {
  title: "Layout/GradientBackground",
  component: GradientBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: "400px", width: "100%" }}>
        <Story />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p className="text-white/40 text-sm">Content over gradient</p>
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof GradientBackground>;

export const Aurora: Story = {
  args: {
    variant: "aurora",
  },
};

export const Nebula: Story = {
  args: {
    variant: "nebula",
  },
};

export const Warm: Story = {
  args: {
    variant: "warm",
  },
};

export const Animated: Story = {
  args: {
    variant: "aurora",
    animate: true,
  },
};

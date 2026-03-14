import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Button } from "./Button";

const meta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["ring", "dots", "bars", "pulse", "ring-fill"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: { control: "color" },
    speed: { control: { type: "range", min: 0.25, max: 3, step: 0.25 } },
    thickness: { control: { type: "range", min: 1, max: 8, step: 1 } },
    showLabel: { control: "boolean" },
    label: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    type: "ring",
    size: "md",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(["ring", "ring-fill", "dots", "bars", "pulse"] as const).map(
        (type) => (
          <div key={type} className="flex flex-col items-center gap-3">
            <Spinner type={type} size="lg" />
            <span className="text-xs text-white/40">{type}</span>
          </div>
        )
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Spinner size={size} />
          <span className="text-xs text-white/40">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="var(--color-accent)" />
        <span className="text-xs text-white/40">accent</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="#59d499" />
        <span className="text-xs text-white/40">green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="#56c2ff" />
        <span className="text-xs text-white/40">blue</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="#9b4dff" />
        <span className="text-xs text-white/40">purple</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" color="#ffa500" />
        <span className="text-xs text-white/40">orange</span>
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    type: "ring",
    size: "lg",
    showLabel: true,
    label: "Loading data...",
  },
};

export const Speed: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {[
        { speed: 0.5, label: "Slow (0.5x)" },
        { speed: 1, label: "Normal (1x)" },
        { speed: 2, label: "Fast (2x)" },
      ].map(({ speed, label }) => (
        <div key={speed} className="flex flex-col items-center gap-3">
          <Spinner size="lg" speed={speed} />
          <span className="text-xs text-white/40">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Thickness: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {[1, 2, 3, 4, 6].map((thickness) => (
        <div key={thickness} className="flex flex-col items-center gap-3">
          <Spinner size="xl" thickness={thickness} />
          <span className="text-xs text-white/40">{thickness}px</span>
        </div>
      ))}
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>
        <Spinner size="xs" color="currentColor" />
        Saving...
      </Button>
      <Button variant="secondary" disabled>
        <Spinner size="xs" color="currentColor" />
        Processing
      </Button>
    </div>
  ),
};

export const RingFill: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Spinner type="ring-fill" size={size} />
          <span className="text-xs text-white/40">{size}</span>
        </div>
      ))}
    </div>
  ),
};

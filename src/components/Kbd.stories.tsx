import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: {
    children: "K",
  },
};

export const Shortcut: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Kbd>cmd</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
};

export const KeysCombo: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Kbd keys={["cmd", "K"]} />
        <span className="text-sm text-white/60">Command palette</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd keys={["cmd", "shift", "P"]} />
        <span className="text-sm text-white/60">Quick actions</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd keys={["ctrl", "alt", "delete"]} />
        <span className="text-sm text-white/60">Task manager</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd keys={["cmd", "enter"]} />
        <span className="text-sm text-white/60">Submit</span>
      </div>
    </div>
  ),
};

export const SpecialKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>cmd</Kbd>
      <Kbd>ctrl</Kbd>
      <Kbd>alt</Kbd>
      <Kbd>shift</Kbd>
      <Kbd>enter</Kbd>
      <Kbd>tab</Kbd>
      <Kbd>escape</Kbd>
      <Kbd>backspace</Kbd>
      <Kbd>delete</Kbd>
      <Kbd>space</Kbd>
      <Kbd>capslock</Kbd>
      <Kbd>fn</Kbd>
    </div>
  ),
};

export const ArrowKeys: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-1">
      <Kbd>up</Kbd>
      <div className="flex gap-1">
        <Kbd>left</Kbd>
        <Kbd>down</Kbd>
        <Kbd>right</Kbd>
      </div>
    </div>
  ),
};

export const FunctionKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 12 }, (_, i) => (
        <Kbd key={i}>{`f${i + 1}`}</Kbd>
      ))}
    </div>
  ),
};

export const NavigationKeys: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>home</Kbd>
      <Kbd>end</Kbd>
      <Kbd>pageup</Kbd>
      <Kbd>pagedown</Kbd>
    </div>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Kbd keys={["cmd", "shift", "P"]} separator="+" />
      <Kbd keys={["ctrl", "C"]} separator="+" />
      <Kbd keys={["alt", "tab"]} separator="then" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <span className="text-xs text-white/60 w-8">sm</span>
        <Kbd size="sm" keys={["cmd", "K"]} />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-white/60 w-8">md</span>
        <Kbd keys={["cmd", "K"]} />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-white/60 w-8">lg</span>
        <Kbd size="lg" keys={["cmd", "K"]} />
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="flex items-center justify-between rounded-md border border-white/6 bg-white/[0.02] px-3 py-2">
        <span className="text-sm text-white/60">Search</span>
        <Kbd keys={["cmd", "K"]} size="sm" />
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/6 bg-white/[0.02] px-3 py-2">
        <span className="text-sm text-white/60">Save</span>
        <Kbd keys={["cmd", "S"]} size="sm" />
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/6 bg-white/[0.02] px-3 py-2">
        <span className="text-sm text-white/60">Undo</span>
        <Kbd keys={["cmd", "Z"]} size="sm" />
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/6 bg-white/[0.02] px-3 py-2">
        <span className="text-sm text-white/60">Copy</span>
        <Kbd keys={["cmd", "C"]} size="sm" />
      </div>
    </div>
  ),
};

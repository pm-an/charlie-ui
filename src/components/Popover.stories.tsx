import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { Popover } from "./Popover";
import { Button } from "./Button";
import { Input } from "./Input";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-start justify-center pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">Notifications</p>
          <p className="text-sm text-white/60">
            You have 3 unread messages. Check your inbox for the latest updates
            from your team.
          </p>
        </div>
      </Popover.Content>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Popover" });
    await expect(trigger).toBeVisible();
    // Content should be hidden initially
    expect(canvas.queryByText("You have 3 unread messages.")).not.toBeInTheDocument();
    // Click to open
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(canvas.getByText(/You have 3 unread messages/)).toBeVisible();
    });
  },
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Set dimensions</Button>
      </Popover.Trigger>
      <Popover.Content className="w-[320px]">
        <div className="space-y-4">
          <p className="text-sm font-medium text-white">Dimensions</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Width" placeholder="100%" />
            <Input label="Height" placeholder="auto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Max width" placeholder="300px" />
            <Input label="Max height" placeholder="none" />
          </div>
          <Popover.Close asChild>
            <Button variant="primary" className="w-full">
              Apply
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const WithClose: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Show details</Button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Session info</p>
          <p className="text-sm text-white/60">
            Your current session has been active for 2 hours. All changes are
            saved automatically.
          </p>
          <Popover.Close>
            <Button variant="ghost" size="sm">
              Done
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Align start</Button>
      </Popover.Trigger>
      <Popover.Content align="start">
        <p className="text-sm text-white/60">
          This popover is aligned to the start of the trigger.
        </p>
      </Popover.Content>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Align end</Button>
      </Popover.Trigger>
      <Popover.Content align="end">
        <p className="text-sm text-white/60">
          This popover is aligned to the end of the trigger.
        </p>
      </Popover.Content>
    </Popover>
  ),
};

export const TopSide: Story = {
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-end justify-center pb-12">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open above</Button>
      </Popover.Trigger>
      <Popover.Content side="top">
        <p className="text-sm text-white/60">
          This popover opens above the trigger element.
        </p>
      </Popover.Content>
    </Popover>
  ),
};

export const NonDismissible: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open sticky popover</Button>
      </Popover.Trigger>
      <Popover.Content dismissible={false} aria-label="Confirm action">
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Confirm action</p>
          <p className="text-sm text-white/60">
            This popover won't close when you click outside or press Escape.
            Use the button below to dismiss it.
          </p>
          <Popover.Close asChild>
            <Button variant="primary" size="sm" className="w-full">
              Confirm
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const WithFocusTrap: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open with focus trap</Button>
      </Popover.Trigger>
      <Popover.Content trapFocus aria-label="Focus trapped popover">
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Trapped focus</p>
          <p className="text-sm text-white/60">
            Tab focus is trapped within this popover. Press Escape or click
            the button below to close.
          </p>
          <Popover.Close asChild>
            <Button variant="primary" size="sm" className="w-full">
              Done
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-white/60">
          Popover is {open ? "open" : "closed"}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Open externally
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Close externally
          </Button>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button variant="secondary">Controlled trigger</Button>
          </Popover.Trigger>
          <Popover.Content>
            <p className="text-sm text-white/60">
              This popover is controlled by external state. Use the buttons
              above or click the trigger to toggle.
            </p>
          </Popover.Content>
        </Popover>
      </div>
    );
  },
};

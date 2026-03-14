import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Collapsible } from "./Collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Data Display/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <Collapsible.Trigger className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        Toggle section
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pt-2 text-sm text-white/60">
          This content is hidden by default and reveals when you click the
          trigger above. It animates smoothly using Framer Motion.
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Toggle section" });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/hidden by default/)).toBeInTheDocument();
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <Collapsible.Trigger className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        API credentials
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pt-2 text-sm text-white/60">
          Your API key is <code className="text-white/80">sk-abc123...</code>.
          Keep this secret and never share it publicly.
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "API credentials" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(/Your API key/)).toBeInTheDocument();
  },
};

export const Controlled: Story = {
  render: function ControlledCollapsible() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="space-y-3">
        <button
          className="text-xs text-white/40 hover:text-white/60 transition-colors"
          onClick={() => setOpen((prev) => !prev)}
        >
          External toggle ({open ? "open" : "closed"})
        </button>
        <Collapsible open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Advanced settings
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="pt-2 text-sm text-white/60">
              These settings let you fine-tune build optimisation, cache
              invalidation, and deployment targets.
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalToggle = canvas.getByText(/External toggle/);
    await expect(externalToggle).toBeVisible();
    // Initially closed
    await expect(
      canvas.getByRole("button", { name: "Advanced settings" })
    ).toHaveAttribute("aria-expanded", "false");
    // Open via external button
    await userEvent.click(externalToggle);
    await expect(
      canvas.getByRole("button", { name: "Advanced settings" })
    ).toHaveAttribute("aria-expanded", "true");
  },
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled>
      <Collapsible.Trigger className="text-sm font-medium text-white/30 cursor-not-allowed">
        Locked section
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pt-2 text-sm text-white/60">
          You should never see this content because the collapsible is disabled.
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Locked section" });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

export const CustomTrigger: Story = {
  render: function CustomTriggerStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild className="cursor-pointer">
          <div className="flex items-center gap-2 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors">
            <span>{open ? "Hide" : "Show"} release notes</span>
            <span className="text-xs text-white/40">{open ? "v" : ">"}</span>
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="mt-2 rounded-md bg-white/5 border border-white/10 p-3 text-sm text-white/60">
            <p className="font-medium text-white/80 mb-1">v2.4.0</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Added Collapsible component with animation</li>
              <li>Improved CopyButton feedback timing</li>
              <li>Fixed Accordion keyboard navigation</li>
            </ul>
          </div>
        </Collapsible.Content>
      </Collapsible>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Show release notes")).toBeVisible();
    await userEvent.click(canvas.getByText("Show release notes"));
    await expect(canvas.getByText(/v2\.4\.0/)).toBeInTheDocument();
  },
};

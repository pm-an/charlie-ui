import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer } from "./Drawer";
import { Button } from "./Button";
import { Input } from "./Input";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 500 } },
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  args: {
    title: "Notifications",
    description: "You have 3 unread messages.",
    side: "right",
    size: "md",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            {[
              { title: "New deployment", time: "2 minutes ago", read: false },
              { title: "Build succeeded", time: "1 hour ago", read: false },
              { title: "Team invite accepted", time: "3 hours ago", read: false },
            ].map((notification) => (
              <div
                key={notification.title}
                className="flex items-start gap-3 rounded-lg border border-white/10 p-3"
              >
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    notification.read ? "bg-white/20" : "bg-accent"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="text-xs text-white/60">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Drawer>
      </>
    );
  },
};

export const LeftSide: Story = {
  args: {
    title: "Navigation",
    side: "left",
    size: "sm",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    const links = ["Dashboard", "Projects", "Settings", "Team", "Billing"];
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Left Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <nav className="space-y-1">
            {links.map((link) => (
              <button
                key={link}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link}
              </button>
            ))}
          </nav>
        </Drawer>
      </>
    );
  },
};

export const TopSide: Story = {
  args: {
    title: "Search",
    description: "Find anything across your workspace.",
    side: "top",
    size: "sm",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Top Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
            />
            <div className="text-xs text-white/60">
              Recent: Dashboard, API Keys, Team Settings
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

export const BottomSide: Story = {
  args: {
    title: "Quick actions",
    side: "bottom",
    size: "sm",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Bottom Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="grid grid-cols-3 gap-3">
            {["New project", "Import repo", "Invite team", "API docs", "Support", "Settings"].map(
              (action) => (
                <button
                  key={action}
                  className="flex flex-col items-center gap-2 rounded-lg border border-white/10 p-4 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {action}
                </button>
              )
            )}
          </div>
        </Drawer>
      </>
    );
  },
};

export const SmallSize: Story = {
  args: {
    title: "Filters",
    side: "right",
    size: "sm",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Small Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-white">
                Status
              </label>
              <select className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none">
                <option>All</option>
                <option>Active</option>
                <option>Archived</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-white">
                Sort by
              </label>
              <select className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none">
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Name A-Z</option>
              </select>
            </div>
            <Button variant="primary" className="w-full">
              Apply filters
            </Button>
          </div>
        </Drawer>
      </>
    );
  },
};

export const LargeSize: Story = {
  args: {
    title: "Project details",
    description: "View and edit your project configuration.",
    side: "right",
    size: "lg",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Large Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="space-y-6">
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="mb-3 text-sm font-medium text-white">General</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Project name
                  </label>
                  <input
                    type="text"
                    defaultValue="charlie-ui"
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="A modern React component library built with Tailwind CSS."
                    className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <h3 className="mb-3 text-sm font-medium text-white">
                Environment variables
              </h3>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between">
                  <code>DATABASE_URL</code>
                  <span className="text-white/60">Set</span>
                </div>
                <div className="flex justify-between">
                  <code>API_KEY</code>
                  <span className="text-white/60">Set</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

export const WithoutOverlay: Story = {
  args: {
    title: "Inspector",
    side: "right",
    size: "sm",
    overlay: false,
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Without Overlay
          </Button>
          <p className="mt-4 text-sm text-white/60">
            Notice you can still interact with this content when the drawer is
            open without an overlay.
          </p>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <div className="rounded-md border border-white/10 p-3">
              <p className="text-xs text-white/60">Element</p>
              <p className="text-sm text-white">Button.primary</p>
            </div>
            <div className="rounded-md border border-white/10 p-3">
              <p className="text-xs text-white/60">Width</p>
              <p className="text-sm text-white">120px</p>
            </div>
            <div className="rounded-md border border-white/10 p-3">
              <p className="text-xs text-white/60">Height</p>
              <p className="text-sm text-white">40px</p>
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

export const CustomContent: Story = {
  args: {
    title: "Create new project",
    description: "Fill in the details below to get started.",
    side: "right",
    size: "md",
  },
  render: function DrawerStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Form Drawer
          </Button>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <form
            className="flex h-full flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <div className="flex-1 space-y-4">
              <Input label="Project name" placeholder="my-awesome-project" />
              <Input
                label="Repository URL"
                placeholder="https://github.com/..."
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-white">
                  Framework
                </label>
                <select className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none">
                  <option>Next.js</option>
                  <option>Remix</option>
                  <option>Vite</option>
                  <option>Astro</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create project
              </Button>
            </div>
          </form>
        </Drawer>
      </>
    );
  },
};

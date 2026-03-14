import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FileText, Settings, Users, Search, BarChart3, LogOut } from "lucide-react";
import { CommandPalette, CommandGroup, CommandItem } from "./CommandPalette";
import { Button } from "./Button";

const meta: Meta<typeof CommandPalette> = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 500 } },
  },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: {
    open: true,
    placeholder: "Type a command or search...",
  },
  render: function PaletteStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Command Palette (⌘K)
          </Button>
        </div>
        <CommandPalette {...args} open={open} onOpenChange={setOpen}>
          <CommandGroup label="Pages">
            <CommandItem icon={FileText}>Documentation</CommandItem>
            <CommandItem icon={BarChart3}>Analytics Dashboard</CommandItem>
            <CommandItem icon={Users}>Team Members</CommandItem>
          </CommandGroup>
          <CommandGroup label="Actions">
            <CommandItem icon={Search}>Search Projects</CommandItem>
            <CommandItem icon={Settings}>Account Settings</CommandItem>
            <CommandItem icon={LogOut}>Sign Out</CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Palette should be open — elements in animated modal
    await expect(canvas.getByPlaceholderText("Type a command or search...")).toBeInTheDocument();
    await expect(canvas.getByText("Documentation")).toBeInTheDocument();
    await expect(canvas.getByText("Pages")).toBeInTheDocument();
    await expect(canvas.getByText("Actions")).toBeInTheDocument();
    // Close via Escape
    await userEvent.keyboard("{Escape}");
    // Reopen button should be visible
    await expect(canvas.getByRole("button", { name: /Open Command Palette/ })).toBeVisible();
    // Reopen
    await userEvent.click(canvas.getByRole("button", { name: /Open Command Palette/ }));
    await expect(canvas.getByPlaceholderText("Type a command or search...")).toBeInTheDocument();
  },
};

export const WithActiveItem: Story = {
  args: {
    open: true,
    placeholder: "Type a command or search...",
  },
  render: function PaletteStory(args) {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <div className="p-6">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open Command Palette (⌘K)
          </Button>
        </div>
        <CommandPalette {...args} open={open} onOpenChange={setOpen}>
          <CommandGroup label="Recent">
            <CommandItem icon={FileText} active>
              Documentation
            </CommandItem>
            <CommandItem icon={BarChart3}>Analytics Dashboard</CommandItem>
            <CommandItem icon={Settings}>Account Settings</CommandItem>
          </CommandGroup>
        </CommandPalette>
      </>
    );
  },
};

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Copy,
  Pencil,
  Trash2,
  Share,
  Download,
  Star,
  Eye,
  ArrowUpRight,
  Clipboard,
  RotateCcw,
  Settings,
} from "lucide-react";
import { ContextMenu } from "./ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: function DefaultStory() {
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="flex h-48 w-80 items-center justify-center rounded-lg border border-dashed border-white/20 text-sm text-white/40">
            Right-click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Back</ContextMenu.Item>
          <ContextMenu.Item>Forward</ContextMenu.Item>
          <ContextMenu.Item>Reload</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>View Page Source</ContextMenu.Item>
          <ContextMenu.Item>Inspect Element</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="flex h-48 w-80 items-center justify-center rounded-lg border border-dashed border-white/20 text-sm text-white/40">
            Right-click for file actions
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item icon={<Eye />} shortcut="Space">
            Quick Look
          </ContextMenu.Item>
          <ContextMenu.Item icon={<ArrowUpRight />}>
            Open in New Tab
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Copy />} shortcut="Cmd+C">
            Copy
          </ContextMenu.Item>
          <ContextMenu.Item icon={<Clipboard />} shortcut="Cmd+V">
            Paste
          </ContextMenu.Item>
          <ContextMenu.Item icon={<Pencil />}>Rename</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Download />}>Download</ContextMenu.Item>
          <ContextMenu.Item icon={<Share />}>Share</ContextMenu.Item>
          <ContextMenu.Item icon={<Star />}>Add to Favorites</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Trash2 />} destructive>
            Move to Trash
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};

export const Complex: Story = {
  render: function ComplexStory() {
    const [showHidden, setShowHidden] = React.useState(false);
    const [sortBy, setSortBy] = React.useState("name");

    return (
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="flex h-48 w-80 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 text-sm text-white/40">
            <span>Desktop workspace area</span>
            <span className="text-xs text-white/20">Right-click to manage</span>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>View</ContextMenu.Label>
          <ContextMenu.RadioGroup value={sortBy} onValueChange={setSortBy}>
            <ContextMenu.RadioItem value="name">Sort by Name</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="date">Sort by Date</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="size">Sort by Size</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
            Show Hidden Files
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<RotateCcw />} shortcut="Cmd+R">
            Refresh
          </ContextMenu.Item>
          <ContextMenu.Item icon={<Settings />}>
            Display Settings
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={<Clipboard />} shortcut="Cmd+V">
            Paste
          </ContextMenu.Item>
          <ContextMenu.Item icon={<Pencil />}>
            New Folder
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
  },
};

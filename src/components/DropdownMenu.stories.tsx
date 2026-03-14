import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Copy,
  Pencil,
  Trash2,
  Share,
  Download,
  Star,
  Archive,
  Eye,
  EyeOff,
  Settings,
  User,
  LogOut,
  Bell,
  Moon,
} from "lucide-react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "./Button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-[350px] items-start justify-center p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: function DefaultStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Open Menu</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>New File</DropdownMenu.Item>
          <DropdownMenu.Item>Open Project</DropdownMenu.Item>
          <DropdownMenu.Item>Save</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Exit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<Copy />}>Copy</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Pencil />}>Edit</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Share />}>Share</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Download />}>Download</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={<Star />}>Add to Favorites</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Archive />}>Archive</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const WithShortcuts: Story = {
  render: function WithShortcutsStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Edit</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item shortcut="Cmd+C">Copy</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="Cmd+V">Paste</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="Cmd+X">Cut</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item shortcut="Cmd+Z">Undo</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="Cmd+Shift+Z">Redo</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const WithCheckboxItems: Story = {
  render: function WithCheckboxItemsStory() {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showPanel, setShowPanel] = React.useState(false);
    const [wordWrap, setWordWrap] = React.useState(true);

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">View Options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Appearance</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Status Bar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Panel
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
            Word Wrap
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: function WithRadioItemsStory() {
    const [theme, setTheme] = React.useState("dark");

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Theme</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Select Theme</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const WithLabels: Story = {
  render: function WithLabelsStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Organize</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>File</DropdownMenu.Label>
          <DropdownMenu.Item>New Document</DropdownMenu.Item>
          <DropdownMenu.Item>Open Recent</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Edit</DropdownMenu.Label>
          <DropdownMenu.Item>Find and Replace</DropdownMenu.Item>
          <DropdownMenu.Item>Preferences</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Destructive: Story = {
  render: function DestructiveStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Manage</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<Pencil />}>Rename</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Copy />}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={<Trash2 />} destructive>
            Delete Project
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const DisabledItems: Story = {
  render: function DisabledItemsStory() {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<Copy />}>Copy</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Pencil />} disabled>
            Edit (locked)
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={<Share />}>Share</DropdownMenu.Item>
          <DropdownMenu.Item icon={<Trash2 />} disabled destructive>
            Delete (no permission)
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Complex: Story = {
  render: function ComplexStory() {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(true);
    const [status, setStatus] = React.useState("online");

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Item icon={<User />} shortcut="Cmd+P">
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={<Settings />} shortcut="Cmd+,">
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Preferences</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Notifications
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={darkMode} onCheckedChange={setDarkMode}>
            Dark Mode
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Status</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={status} onValueChange={setStatus}>
            <DropdownMenu.RadioItem value="online">Online</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="away">Away</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="busy">Do Not Disturb</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={<LogOut />} destructive>
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

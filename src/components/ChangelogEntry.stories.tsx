import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChangelogEntry } from "./ChangelogEntry";

const meta: Meta<typeof ChangelogEntry> = {
  title: "Cards/ChangelogEntry",
  component: ChangelogEntry,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChangelogEntry>;

export const Default: Story = {
  args: {
    date: "Mar 10, 2026",
    version: "v2.4.0",
    title: "Redesigned Dashboard Experience",
    description:
      "We completely rebuilt the analytics dashboard with real-time data streaming, customizable widgets, and a new drag-and-drop layout editor. Performance improved by 3x on large datasets.",
  },
};

export const WithTags: Story = {
  args: {
    date: "Mar 5, 2026",
    version: "v2.3.1",
    title: "Command Palette and Keyboard Shortcuts",
    description:
      "Introducing a new command palette (⌘K) for lightning-fast navigation, plus over 30 new keyboard shortcuts to keep your hands on the keyboard.",
    tags: ["Feature", "UX", "Accessibility"],
  },
};

export const WithImage: Story = {
  args: {
    date: "Feb 28, 2026",
    version: "v2.3.0",
    title: "Dark Mode and Theme System",
    description:
      "Choose from 7 built-in color themes or create your own with our new CSS custom property system. Every component adapts seamlessly.",
    tags: ["Design", "Theming"],
    image: "https://placehold.co/800x400/1a1a2e/ffffff?text=Theme+Preview",
  },
};

export const Timeline: Story = {
  render: () => (
    <div>
      <ChangelogEntry
        date="Mar 10, 2026"
        version="v2.4.0"
        title="Redesigned Dashboard Experience"
        description="We completely rebuilt the analytics dashboard with real-time data streaming, customizable widgets, and a new drag-and-drop layout editor."
        tags={["Feature", "Performance"]}
      />
      <ChangelogEntry
        date="Mar 5, 2026"
        version="v2.3.1"
        title="Command Palette and Keyboard Shortcuts"
        description="Introducing a new command palette (⌘K) for lightning-fast navigation, plus over 30 new keyboard shortcuts."
        tags={["Feature", "UX"]}
      />
      <ChangelogEntry
        date="Feb 28, 2026"
        version="v2.3.0"
        title="Dark Mode and Theme System"
        description="Choose from 7 built-in color themes or create your own with our new CSS custom property system."
        tags={["Design", "Theming"]}
      />
      <ChangelogEntry
        date="Feb 15, 2026"
        version="v2.2.0"
        title="Toast Notifications"
        description="A fully animated toast system with success, error, and warning variants, auto-dismiss timers, and action buttons."
        tags={["Feature"]}
      />
    </div>
  ),
};

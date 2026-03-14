import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextEditor } from "./RichTextEditor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Forms/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "minimal", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    editable: { control: "boolean" },
    placeholder: { control: "text" },
  },
  parameters: {
    layout: "padded",
  },
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

const sampleContent = `
<h2>Welcome to Charlie UI</h2>
<p>This is a <strong>rich text editor</strong> built on <a href="https://tiptap.dev">Tiptap</a> and deeply themed with Charlie UI design tokens.</p>
<ul>
  <li>Bold, italic, underline, and strikethrough</li>
  <li>Headings, lists, and blockquotes</li>
  <li>Code blocks and inline code</li>
  <li>Task lists with checkboxes</li>
</ul>
<blockquote>The editor toolbar is fully configurable — show, hide, or reorder groups as needed.</blockquote>
`;

export const Default: Story = {
  args: {
    placeholder: "Start writing something amazing…",
  },
};

export const WithContent: Story = {
  args: {
    defaultContent: sampleContent,
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    defaultContent: "<p>A minimal editor with no visible border.</p>",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    defaultContent: "<p>Ghost variant — transparent background with a border.</p>",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    placeholder: "Compact editor…",
    minHeight: "100px",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    placeholder: "Large editor for long-form content…",
    minHeight: "300px",
  },
};

export const ReadOnly: Story = {
  args: {
    editable: false,
    defaultContent: sampleContent,
    toolbar: { hidden: true },
  },
};

export const HiddenToolbar: Story = {
  args: {
    toolbar: { hidden: true },
    placeholder: "Editor without a toolbar…",
  },
};

export const CustomToolbarGroups: Story = {
  args: {
    toolbar: { groups: ["textFormatting", "headings", "lists", "undo"] },
    placeholder: "Only text formatting, headings, lists, and undo…",
  },
};

export const WithBubbleMenu: Story = {
  args: {
    bubbleMenu: true,
    defaultContent: "<p>Select some text to see the floating bubble menu appear.</p>",
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [html, setHtml] = React.useState(
      "<p>Edit this text and watch the HTML update below.</p>"
    );

    return (
      <div className="space-y-4">
        <RichTextEditor content={html} onChange={setHtml} />
        <div className="rounded-lg border border-white/[0.06] bg-surface-elevated p-4">
          <p className="text-xs text-white/60 mb-2">Raw HTML output:</p>
          <pre className="text-xs text-white/60 whitespace-pre-wrap break-all">
            {html}
          </pre>
        </div>
      </div>
    );
  },
};

export const CompoundComponents: Story = {
  render: function CompoundStory() {
    return (
      <RichTextEditor
        defaultContent="<p>This editor uses compound components for full layout control.</p>"
      >
        <RichTextEditor.Toolbar groups={["textFormatting", "headings"]} />
        <div className="px-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <RichTextEditor.Content minHeight="200px" />
      </RichTextEditor>
    );
  },
};

export const DisabledExtensions: Story = {
  args: {
    defaultContent:
      "<p>This editor has underline, highlight, and task lists disabled.</p>",
    extensionConfig: {
      disableDefaults: ["underline", "highlight", "taskList", "taskItem"],
    },
    toolbar: {
      groups: ["textFormatting", "headings", "lists", "undo"],
    },
  },
};

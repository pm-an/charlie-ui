import type { Editor } from "@tiptap/core";
import type { ComponentType } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Unlink,
  CodeSquare,
  Quote,
  Highlighter,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

/* ─── Types ────────────────────────────────── */

export type ToolbarGroup =
  | "textFormatting"
  | "headings"
  | "lists"
  | "alignment"
  | "links"
  | "codeBlock"
  | "blockquote"
  | "highlight"
  | "color"
  | "horizontalRule"
  | "undo";

export interface ToolbarConfig {
  /** Which groups to show, in order */
  groups?: ToolbarGroup[];
  /** Hide toolbar entirely */
  hidden?: boolean;
}

export interface CustomToolbarItem {
  key: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  group?: ToolbarGroup | "custom";
}

export interface ToolbarItemDef {
  key: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

/* ─── Default Groups ───────────────────────── */

export const DEFAULT_TOOLBAR_GROUPS: ToolbarGroup[] = [
  "textFormatting",
  "headings",
  "lists",
  "alignment",
  "links",
  "codeBlock",
  "blockquote",
  "highlight",
  "horizontalRule",
  "undo",
];

const setLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Enter URL", previousUrl ?? "https://");
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};

export const TOOLBAR_GROUPS: Record<ToolbarGroup, ToolbarItemDef[]> = {
  textFormatting: [
    {
      key: "bold",
      icon: Bold,
      label: "Bold",
      action: (e) => e.chain().focus().toggleBold().run(),
      isActive: (e) => e.isActive("bold"),
    },
    {
      key: "italic",
      icon: Italic,
      label: "Italic",
      action: (e) => e.chain().focus().toggleItalic().run(),
      isActive: (e) => e.isActive("italic"),
    },
    {
      key: "underline",
      icon: Underline,
      label: "Underline",
      action: (e) => e.chain().focus().toggleUnderline().run(),
      isActive: (e) => e.isActive("underline"),
    },
    {
      key: "strike",
      icon: Strikethrough,
      label: "Strikethrough",
      action: (e) => e.chain().focus().toggleStrike().run(),
      isActive: (e) => e.isActive("strike"),
    },
    {
      key: "code",
      icon: Code,
      label: "Inline code",
      action: (e) => e.chain().focus().toggleCode().run(),
      isActive: (e) => e.isActive("code"),
    },
  ],
  headings: [
    {
      key: "h1",
      icon: Heading1,
      label: "Heading 1",
      action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (e) => e.isActive("heading", { level: 1 }),
    },
    {
      key: "h2",
      icon: Heading2,
      label: "Heading 2",
      action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (e) => e.isActive("heading", { level: 2 }),
    },
    {
      key: "h3",
      icon: Heading3,
      label: "Heading 3",
      action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (e) => e.isActive("heading", { level: 3 }),
    },
  ],
  lists: [
    {
      key: "bulletList",
      icon: List,
      label: "Bullet list",
      action: (e) => e.chain().focus().toggleBulletList().run(),
      isActive: (e) => e.isActive("bulletList"),
    },
    {
      key: "orderedList",
      icon: ListOrdered,
      label: "Ordered list",
      action: (e) => e.chain().focus().toggleOrderedList().run(),
      isActive: (e) => e.isActive("orderedList"),
    },
    {
      key: "taskList",
      icon: ListTodo,
      label: "Task list",
      action: (e) => e.chain().focus().toggleTaskList().run(),
      isActive: (e) => e.isActive("taskList"),
    },
  ],
  alignment: [
    {
      key: "alignLeft",
      icon: AlignLeft,
      label: "Align left",
      action: (e) => e.chain().focus().setTextAlign("left").run(),
      isActive: (e) => e.isActive({ textAlign: "left" }),
    },
    {
      key: "alignCenter",
      icon: AlignCenter,
      label: "Align center",
      action: (e) => e.chain().focus().setTextAlign("center").run(),
      isActive: (e) => e.isActive({ textAlign: "center" }),
    },
    {
      key: "alignRight",
      icon: AlignRight,
      label: "Align right",
      action: (e) => e.chain().focus().setTextAlign("right").run(),
      isActive: (e) => e.isActive({ textAlign: "right" }),
    },
    {
      key: "alignJustify",
      icon: AlignJustify,
      label: "Justify",
      action: (e) => e.chain().focus().setTextAlign("justify").run(),
      isActive: (e) => e.isActive({ textAlign: "justify" }),
    },
  ],
  links: [
    {
      key: "link",
      icon: Link,
      label: "Add link",
      action: setLink,
      isActive: (e) => e.isActive("link"),
    },
    {
      key: "unlink",
      icon: Unlink,
      label: "Remove link",
      action: (e) => e.chain().focus().unsetLink().run(),
    },
  ],
  codeBlock: [
    {
      key: "codeBlock",
      icon: CodeSquare,
      label: "Code block",
      action: (e) => e.chain().focus().toggleCodeBlock().run(),
      isActive: (e) => e.isActive("codeBlock"),
    },
  ],
  blockquote: [
    {
      key: "blockquote",
      icon: Quote,
      label: "Blockquote",
      action: (e) => e.chain().focus().toggleBlockquote().run(),
      isActive: (e) => e.isActive("blockquote"),
    },
  ],
  highlight: [
    {
      key: "highlight",
      icon: Highlighter,
      label: "Highlight",
      action: (e) => e.chain().focus().toggleHighlight().run(),
      isActive: (e) => e.isActive("highlight"),
    },
  ],
  color: [],
  horizontalRule: [
    {
      key: "horizontalRule",
      icon: Minus,
      label: "Horizontal rule",
      action: (e) => e.chain().focus().setHorizontalRule().run(),
    },
  ],
  undo: [
    {
      key: "undo",
      icon: Undo,
      label: "Undo",
      action: (e) => e.chain().focus().undo().run(),
    },
    {
      key: "redo",
      icon: Redo,
      label: "Redo",
      action: (e) => e.chain().focus().redo().run(),
    },
  ],
};

/**
 * Map of default extension name → toolbar item keys whose action depends on
 * that extension being registered. When a consumer disables an extension via
 * `extensionConfig.disableDefaults`, the matching toolbar items are filtered
 * out so the toolbar stays in sync with the active extension set.
 *
 * NOTE: `link` is intentionally NOT mapped here. Tiptap v3 StarterKit already
 * ships the Link extension, so consumers who disable charlie-ui's separate
 * Link registration (to silence the duplicate-extension warning) still have
 * a working link mark and therefore should still see the link toolbar buttons.
 */
const EXTENSION_TO_ITEM_KEYS: Record<string, readonly string[]> = {
  underline: ["underline"],
  textAlign: ["alignLeft", "alignCenter", "alignRight", "alignJustify"],
  highlight: ["highlight"],
  taskList: ["taskList"],
};

/** Build a flat list of toolbar items from the group config */
export function resolveToolbarItems(
  groups: ToolbarGroup[] = DEFAULT_TOOLBAR_GROUPS,
  customItems: CustomToolbarItem[] = [],
  disabledExtensions: readonly string[] = []
): { group: ToolbarGroup | "custom"; items: ToolbarItemDef[] }[] {
  const disabledKeys = new Set<string>();
  for (const ext of disabledExtensions) {
    const keys = EXTENSION_TO_ITEM_KEYS[ext];
    if (keys) {
      for (const k of keys) disabledKeys.add(k);
    }
  }

  const result: { group: ToolbarGroup | "custom"; items: ToolbarItemDef[] }[] = [];

  for (const group of groups) {
    const builtinItems = (TOOLBAR_GROUPS[group] ?? []).filter(
      (item) => !disabledKeys.has(item.key)
    );
    const custom = customItems
      .filter((c) => c.group === group)
      .map(({ key, icon, label, action, isActive }) => ({
        key,
        icon,
        label,
        action,
        isActive,
      }));
    const combined = [...builtinItems, ...custom];
    if (combined.length > 0) {
      result.push({ group, items: combined });
    }
  }

  // Append ungrouped custom items
  const ungrouped = customItems.filter(
    (c) => !c.group || c.group === "custom"
  );
  if (ungrouped.length > 0) {
    result.push({
      group: "custom",
      items: ungrouped.map(({ key, icon, label, action, isActive }) => ({
        key,
        icon,
        label,
        action,
        isActive,
      })),
    });
  }

  return result;
}

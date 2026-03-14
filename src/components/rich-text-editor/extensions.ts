import type { Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

/* ─── Types ────────────────────────────────── */

export type DefaultExtensionName =
  | "starterKit"
  | "placeholder"
  | "underline"
  | "link"
  | "textAlign"
  | "highlight"
  | "taskList"
  | "taskItem"
  | "typography"
  | "textStyle"
  | "color";

export interface ExtensionConfig {
  /** Additional Tiptap extensions to include */
  extensions?: Extensions;
  /** Turn off specific default extensions */
  disableDefaults?: DefaultExtensionName[];
  /** Override options for specific default extensions */
  overrideDefaults?: Partial<Record<DefaultExtensionName, Record<string, unknown>>>;
}

/* ─── Factory ──────────────────────────────── */

interface CreateDefaultExtensionsOptions {
  placeholder?: string;
  config?: ExtensionConfig;
}

export function createDefaultExtensions({
  placeholder: placeholderText = "Start writing…",
  config = {},
}: CreateDefaultExtensionsOptions = {}): Extensions {
  const { disableDefaults = [], overrideDefaults = {} } = config;

  const isEnabled = (name: DefaultExtensionName) => !disableDefaults.includes(name);

  const getOpts = (name: DefaultExtensionName) =>
    overrideDefaults[name] ?? {};

  const extensions: Extensions = [];

  if (isEnabled("starterKit")) {
    extensions.push(
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        ...getOpts("starterKit"),
      })
    );
  }

  if (isEnabled("placeholder")) {
    extensions.push(
      Placeholder.configure({
        placeholder: placeholderText,
        ...getOpts("placeholder"),
      })
    );
  }

  if (isEnabled("underline")) {
    extensions.push(Underline.configure(getOpts("underline")));
  }

  if (isEnabled("link")) {
    extensions.push(
      Link.configure({
        openOnClick: false,
        autolink: true,
        ...getOpts("link"),
      })
    );
  }

  if (isEnabled("textAlign")) {
    extensions.push(
      TextAlign.configure({
        types: ["heading", "paragraph"],
        ...getOpts("textAlign"),
      })
    );
  }

  if (isEnabled("highlight")) {
    extensions.push(
      Highlight.configure({
        multicolor: true,
        ...getOpts("highlight"),
      })
    );
  }

  if (isEnabled("taskList")) {
    extensions.push(TaskList.configure(getOpts("taskList")));
  }

  if (isEnabled("taskItem")) {
    extensions.push(
      TaskItem.configure({
        nested: true,
        ...getOpts("taskItem"),
      })
    );
  }

  if (isEnabled("typography")) {
    extensions.push(Typography.configure(getOpts("typography")));
  }

  if (isEnabled("textStyle")) {
    extensions.push(TextStyle.configure(getOpts("textStyle")));
  }

  if (isEnabled("color")) {
    extensions.push(Color.configure(getOpts("color")));
  }

  // Add consumer-provided extensions
  if (config.extensions) {
    extensions.push(...config.extensions);
  }

  return extensions;
}

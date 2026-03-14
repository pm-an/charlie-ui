"use client";

import {
  createContext,
  useContext,
  useEffect,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor, EditorOptions, JSONContent } from "@tiptap/core";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";
import {
  createDefaultExtensions,
  type ExtensionConfig,
  type DefaultExtensionName,
} from "./rich-text-editor/extensions";
import {
  resolveToolbarItems,
  DEFAULT_TOOLBAR_GROUPS,
  type ToolbarGroup,
  type ToolbarConfig,
  type CustomToolbarItem,
  type ToolbarItemDef,
} from "./rich-text-editor/toolbar-items";
import "./rich-text-editor/styles.css";

/* ─── CVA Variants ─────────────────────────── */

const richTextEditorVariants = cva(
  "rounded-lg border transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated",
        minimal: "border-transparent bg-transparent",
        ghost: "border-border bg-transparent",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/* ─── Context ──────────────────────────────── */

type RichTextEditorContextValue = {
  editor: Editor | null;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
};

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null);

function useRichTextEditor(): RichTextEditorContextValue {
  const ctx = useContext(RichTextEditorContext);
  if (!ctx)
    throw new Error("useRichTextEditor must be used within a RichTextEditor");
  return ctx;
}

/* ─── Types ────────────────────────────────── */

type RichTextEditorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "content"
> &
  VariantProps<typeof richTextEditorVariants> & {
    /** Uncontrolled initial HTML content */
    defaultContent?: string;
    /** Controlled HTML content */
    content?: string;
    /** HTML change callback */
    onChange?: (html: string) => void;
    /** JSON change callback */
    onJsonChange?: (json: JSONContent) => void;
    /** Called when editor instance is ready */
    onEditorReady?: (editor: Editor) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the editor is editable */
    editable?: boolean;
    /** Autofocus behavior */
    autofocus?: boolean | "start" | "end";
    /** Toolbar configuration */
    toolbar?: ToolbarConfig;
    /** Custom toolbar items */
    customToolbarItems?: CustomToolbarItem[];
    /** Extension configuration */
    extensionConfig?: ExtensionConfig;
    /** Extra Tiptap editor props */
    editorProps?: EditorOptions["editorProps"];
    /** Bubble menu config — true for default, object for custom groups */
    bubbleMenu?: boolean | { groups?: ToolbarGroup[] };
    /** Minimum height for the content area */
    minHeight?: string;
    /** Maximum height for the content area */
    maxHeight?: string;
    /** Children for compound component override */
    children?: ReactNode;
    /** Shows error styling (red border). */
    error?: boolean;
    /** Whether the editor is disabled */
    disabled?: boolean;
  };

type RichTextEditorToolbarProps = HTMLAttributes<HTMLDivElement> & {
  /** Override groups */
  groups?: ToolbarGroup[];
  /** Custom toolbar items */
  customItems?: CustomToolbarItem[];
};

type RichTextEditorContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Min height for the editor */
  minHeight?: string;
  /** Max height for the editor */
  maxHeight?: string;
  /** Accessible label for the editor content area */
  "aria-label"?: string;
};

type RichTextEditorBubbleMenuProps = HTMLAttributes<HTMLDivElement> & {
  /** Groups to show in the bubble menu */
  groups?: ToolbarGroup[];
};

/* ─── Toolbar Button ───────────────────────── */

function ToolbarButton({
  item,
  editor,
}: {
  item: ToolbarItemDef;
  editor: Editor;
}) {
  const Icon = item.icon;
  const isActive = item.isActive?.(editor) ?? false;

  return (
    <button
      type="button"
      onClick={() => item.action(editor)}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
        "text-white/60 hover:text-white hover:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
        isActive && "bg-white/10 text-white"
      )}
      title={item.label}
      aria-label={item.label}
      aria-pressed={isActive}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/* ─── Toolbar ──────────────────────────────── */

const RichTextEditorToolbar = forwardRef<HTMLDivElement, RichTextEditorToolbarProps>(
  ({ className, groups, customItems, ...props }, ref) => {
    const { editor } = useRichTextEditor();
    if (!editor) return null;

    const resolvedGroups = resolveToolbarItems(
      groups ?? DEFAULT_TOOLBAR_GROUPS,
      customItems
    );

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Text formatting"
        className={cn(
          "flex flex-wrap items-center gap-0.5 border-b border-white/[0.06] px-2 py-1.5",
          className
        )}
        {...props}
      >
        {resolvedGroups.map((section, idx) => (
          <div key={section.group} className="flex items-center">
            {idx > 0 && (
              <div className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />
            )}
            {section.items.map((item) => (
              <ToolbarButton key={item.key} item={item} editor={editor} />
            ))}
          </div>
        ))}
      </div>
    );
  }
);
RichTextEditorToolbar.displayName = "RichTextEditor.Toolbar";

/* ─── Content ──────────────────────────────── */

const RichTextEditorContent = forwardRef<HTMLDivElement, RichTextEditorContentProps>(
  ({ className, minHeight, maxHeight, style, "aria-label": ariaLabelProp, ...props }, ref) => {
    const { editor, ariaDescribedBy, ariaInvalid } = useRichTextEditor();
    if (!editor) return null;

    return (
      <div
        ref={ref}
        role="textbox"
        aria-label={ariaLabelProp ?? "Rich text editor"}
        aria-multiline="true"
        className={cn("charlie-rte-content", className)}
        style={{ minHeight, maxHeight, ...style }}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        {...props}
      >
        <EditorContent editor={editor} />
      </div>
    );
  }
);
RichTextEditorContent.displayName = "RichTextEditor.Content";

/* ─── BubbleMenu ───────────────────────────── */

const RichTextEditorBubbleMenu = forwardRef<HTMLDivElement, RichTextEditorBubbleMenuProps>(
  ({ className, groups, ...props }, ref) => {
    const { editor } = useRichTextEditor();
    if (!editor) return null;

    const resolvedGroups = resolveToolbarItems(
      groups ?? ["textFormatting", "links"]
    );

    return (
      <BubbleMenu editor={editor}>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-surface-elevated p-1 shadow-lg",
            className
          )}
          {...props}
        >
          {resolvedGroups.map((section, idx) => (
            <div key={section.group} className="flex items-center">
              {idx > 0 && (
                <div className="mx-0.5 h-4 w-px bg-white/10" aria-hidden="true" />
              )}
              {section.items.map((item) => (
                <ToolbarButton key={item.key} item={item} editor={editor} />
              ))}
            </div>
          ))}
        </div>
      </BubbleMenu>
    );
  }
);
RichTextEditorBubbleMenu.displayName = "RichTextEditor.BubbleMenu";

/* ─── Root ─────────────────────────────────── */

const RichTextEditorRoot = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      className,
      variant,
      size,
      defaultContent,
      content,
      onChange,
      onJsonChange,
      onEditorReady,
      placeholder = "Start writing…",
      editable = true,
      autofocus = false,
      toolbar,
      customToolbarItems,
      extensionConfig,
      editorProps,
      bubbleMenu,
      minHeight = "150px",
      maxHeight,
      children,
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      error: resolvedError,
      disabled: resolvedDisabled,
      ariaDescribedBy,
      ariaInvalid,
    } = useFieldAware({ id: undefined, error, disabled, required: undefined });
    const extensions = createDefaultExtensions({
      placeholder,
      config: extensionConfig,
    });

    const editor = useEditor({
      extensions,
      content: content ?? defaultContent ?? "",
      editable,
      autofocus: autofocus as EditorOptions["autofocus"],
      editorProps: {
        ...editorProps,
        attributes: {
          ...(editorProps?.attributes as Record<string, string>),
          "aria-label": ((editorProps?.attributes as Record<string, string>)?.["aria-label"]) ?? "Rich text editor",
        },
      },
      onUpdate: ({ editor: e }) => {
        onChange?.(e.getHTML());
        onJsonChange?.(e.getJSON());
      },
    });

    // Sync controlled content
    useEffect(() => {
      if (editor && content !== undefined) {
        const currentHTML = editor.getHTML();
        if (currentHTML !== content) {
          editor.commands.setContent(content, { emitUpdate: false });
        }
      }
    }, [editor, content]);

    // Sync editable
    useEffect(() => {
      if (editor) {
        editor.setEditable(editable);
      }
    }, [editor, editable]);

    // onEditorReady callback
    useEffect(() => {
      if (editor && onEditorReady) {
        onEditorReady(editor);
      }
    }, [editor, onEditorReady]);

    const showToolbar = !toolbar?.hidden;
    const toolbarGroups = toolbar?.groups;

    // Bubble menu config
    const bubbleMenuConfig =
      bubbleMenu === true
        ? { groups: ["textFormatting", "links"] as ToolbarGroup[] }
        : bubbleMenu
          ? bubbleMenu
          : null;

    // If no children, auto-render default layout
    const hasChildren = children !== undefined && children !== null;

    return (
      <RichTextEditorContext.Provider value={{ editor, ariaDescribedBy, ariaInvalid }}>
        <div
          ref={ref}
          className={cn(
            richTextEditorVariants({ variant, size }),
            resolvedError && "border-red/50",
            resolvedDisabled && "opacity-50 pointer-events-none",
            className
          )}
          data-testid="rich-text-editor"
          {...props}
        >
          {hasChildren ? (
            children
          ) : (
            <>
              {showToolbar && (
                <RichTextEditorToolbar
                  groups={toolbarGroups}
                  customItems={customToolbarItems}
                />
              )}
              <RichTextEditorContent
                minHeight={minHeight}
                maxHeight={maxHeight}
              />
              {bubbleMenuConfig && (
                <RichTextEditorBubbleMenu groups={bubbleMenuConfig.groups} />
              )}
            </>
          )}
        </div>
      </RichTextEditorContext.Provider>
    );
  }
);
RichTextEditorRoot.displayName = "RichTextEditor";

/* ─── Compound Export ──────────────────────── */

const RichTextEditor = Object.assign(RichTextEditorRoot, {
  Toolbar: RichTextEditorToolbar,
  Content: RichTextEditorContent,
  BubbleMenu: RichTextEditorBubbleMenu,
});

export {
  RichTextEditor,
  useRichTextEditor,
  richTextEditorVariants,
  createDefaultExtensions,
};
export type {
  RichTextEditorProps,
  RichTextEditorToolbarProps,
  RichTextEditorContentProps,
  RichTextEditorBubbleMenuProps,
  ToolbarGroup,
  ToolbarConfig,
  CustomToolbarItem,
  DefaultExtensionName,
  ExtensionConfig,
};

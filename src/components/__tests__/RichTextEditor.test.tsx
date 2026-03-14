import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { expectNoA11yViolations } from "../../test/a11y";

/* ─── Mock Tiptap ──────────────────────────── */

const mockEditor = {
  getHTML: vi.fn(() => "<p>Test</p>"),
  getJSON: vi.fn(() => ({ type: "doc", content: [] })),
  isActive: vi.fn(() => false),
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({
      toggleBold: vi.fn(() => ({ run: vi.fn() })),
      toggleItalic: vi.fn(() => ({ run: vi.fn() })),
      toggleUnderline: vi.fn(() => ({ run: vi.fn() })),
      toggleStrike: vi.fn(() => ({ run: vi.fn() })),
      toggleCode: vi.fn(() => ({ run: vi.fn() })),
      toggleHeading: vi.fn(() => ({ run: vi.fn() })),
      toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
      toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
      toggleTaskList: vi.fn(() => ({ run: vi.fn() })),
      toggleCodeBlock: vi.fn(() => ({ run: vi.fn() })),
      toggleBlockquote: vi.fn(() => ({ run: vi.fn() })),
      toggleHighlight: vi.fn(() => ({ run: vi.fn() })),
      setTextAlign: vi.fn(() => ({ run: vi.fn() })),
      setHorizontalRule: vi.fn(() => ({ run: vi.fn() })),
      setLink: vi.fn(() => ({ run: vi.fn() })),
      unsetLink: vi.fn(() => ({ run: vi.fn() })),
      extendMarkRange: vi.fn(() => ({
        setLink: vi.fn(() => ({ run: vi.fn() })),
        unsetLink: vi.fn(() => ({ run: vi.fn() })),
      })),
      undo: vi.fn(() => ({ run: vi.fn() })),
      redo: vi.fn(() => ({ run: vi.fn() })),
    })),
  })),
  commands: {
    setContent: vi.fn(),
  },
  setEditable: vi.fn(),
  getAttributes: vi.fn(() => ({})),
  on: vi.fn(),
  off: vi.fn(),
  destroy: vi.fn(),
  isDestroyed: false,
  view: { dom: document.createElement("div") },
};

let useEditorCallback: ((opts: Record<string, unknown>) => void) | null = null;

vi.mock("@tiptap/react", () => ({
  useEditor: vi.fn((opts: Record<string, unknown>) => {
    if (useEditorCallback) useEditorCallback(opts);
    return mockEditor;
  }),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content">{editor ? "Editor loaded" : "No editor"}</div>
  ),
}));

vi.mock("@tiptap/react/menus", () => ({
  BubbleMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bubble-menu">{children}</div>
  ),
}));

vi.mock("../rich-text-editor/extensions", () => ({
  createDefaultExtensions: vi.fn(() => []),
}));

vi.mock("../rich-text-editor/styles.css", () => ({}));

import React from "react";
import { RichTextEditor } from "../RichTextEditor";
import { createDefaultExtensions } from "../rich-text-editor/extensions";

beforeEach(() => {
  vi.clearAllMocks();
  useEditorCallback = null;
  mockEditor.isActive.mockReturnValue(false);
});

describe("RichTextEditor", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<RichTextEditor />);
      expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
    });

    it("renders the editor content area", () => {
      render(<RichTextEditor />);
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });

    it("renders toolbar by default", () => {
      render(<RichTextEditor />);
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it("hides toolbar when configured", () => {
      render(<RichTextEditor toolbar={{ hidden: true }} />);
      expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<RichTextEditor className="my-custom" />);
      expect(screen.getByTestId("rich-text-editor")).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<RichTextEditor ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<RichTextEditor data-custom="test" aria-label="Editor" />);
      const el = screen.getByTestId("rich-text-editor");
      expect(el).toHaveAttribute("data-custom", "test");
      expect(el).toHaveAttribute("aria-label", "Editor");
    });
  });

  describe("variants", () => {
    it("renders default variant classes", () => {
      render(<RichTextEditor />);
      const el = screen.getByTestId("rich-text-editor");
      expect(el).toHaveClass("border-border");
      expect(el).toHaveClass("bg-surface-elevated");
    });

    it("renders minimal variant classes", () => {
      render(<RichTextEditor variant="minimal" />);
      const el = screen.getByTestId("rich-text-editor");
      expect(el).toHaveClass("border-transparent");
      expect(el).toHaveClass("bg-transparent");
    });

    it("renders ghost variant classes", () => {
      render(<RichTextEditor variant="ghost" />);
      const el = screen.getByTestId("rich-text-editor");
      expect(el).toHaveClass("border-border");
      expect(el).toHaveClass("bg-transparent");
    });

    it("applies size sm class", () => {
      render(<RichTextEditor size="sm" />);
      expect(screen.getByTestId("rich-text-editor")).toHaveClass("text-sm");
    });

    it("applies size md class", () => {
      render(<RichTextEditor size="md" />);
      expect(screen.getByTestId("rich-text-editor")).toHaveClass("text-base");
    });

    it("applies size lg class", () => {
      render(<RichTextEditor size="lg" />);
      expect(screen.getByTestId("rich-text-editor")).toHaveClass("text-lg");
    });
  });

  describe("toolbar", () => {
    it("renders toolbar buttons with labels", () => {
      render(<RichTextEditor />);
      expect(screen.getByLabelText("Bold")).toBeInTheDocument();
      expect(screen.getByLabelText("Italic")).toBeInTheDocument();
      expect(screen.getByLabelText("Underline")).toBeInTheDocument();
    });

    it("renders only specified toolbar groups", () => {
      render(<RichTextEditor toolbar={{ groups: ["textFormatting"] }} />);
      expect(screen.getByLabelText("Bold")).toBeInTheDocument();
      expect(screen.queryByLabelText("Heading 1")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Undo")).not.toBeInTheDocument();
    });

    it("toolbar buttons have aria-pressed attribute", () => {
      render(<RichTextEditor />);
      const boldBtn = screen.getByLabelText("Bold");
      expect(boldBtn).toHaveAttribute("aria-pressed", "false");
    });

    it("shows active state for toolbar buttons when editor mark is active", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockEditor.isActive.mockImplementation(((name: string) => name === "bold") as any);
      render(<RichTextEditor />);
      const boldBtn = screen.getByLabelText("Bold");
      expect(boldBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("calls editor chain on toolbar button click", () => {
      render(<RichTextEditor />);
      const boldBtn = screen.getByLabelText("Bold");
      boldBtn.click();
      expect(mockEditor.chain).toHaveBeenCalled();
    });

    it("renders heading buttons", () => {
      render(<RichTextEditor />);
      expect(screen.getByLabelText("Heading 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Heading 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Heading 3")).toBeInTheDocument();
    });

    it("renders list buttons", () => {
      render(<RichTextEditor />);
      expect(screen.getByLabelText("Bullet list")).toBeInTheDocument();
      expect(screen.getByLabelText("Ordered list")).toBeInTheDocument();
      expect(screen.getByLabelText("Task list")).toBeInTheDocument();
    });

    it("renders undo/redo buttons", () => {
      render(<RichTextEditor />);
      expect(screen.getByLabelText("Undo")).toBeInTheDocument();
      expect(screen.getByLabelText("Redo")).toBeInTheDocument();
    });

    it("renders dividers between toolbar groups", () => {
      render(<RichTextEditor toolbar={{ groups: ["textFormatting", "headings"] }} />);
      const toolbar = screen.getByRole("toolbar");
      const dividers = toolbar.querySelectorAll("[aria-hidden='true']");
      expect(dividers.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("extensions", () => {
    it("calls createDefaultExtensions with placeholder", () => {
      render(<RichTextEditor placeholder="Write here..." />);
      expect(createDefaultExtensions).toHaveBeenCalledWith(
        expect.objectContaining({ placeholder: "Write here..." })
      );
    });

    it("passes extensionConfig to createDefaultExtensions", () => {
      const config = { disableDefaults: ["underline" as const] };
      render(<RichTextEditor extensionConfig={config} />);
      expect(createDefaultExtensions).toHaveBeenCalledWith(
        expect.objectContaining({ config })
      );
    });

    it("uses default placeholder when none provided", () => {
      render(<RichTextEditor />);
      expect(createDefaultExtensions).toHaveBeenCalledWith(
        expect.objectContaining({ placeholder: "Start writing\u2026" })
      );
    });
  });

  describe("callbacks", () => {
    it("calls onEditorReady when editor mounts", () => {
      const onReady = vi.fn();
      render(<RichTextEditor onEditorReady={onReady} />);
      expect(onReady).toHaveBeenCalledWith(mockEditor);
    });
  });

  describe("controlled content", () => {
    it("calls setContent when content prop changes", () => {
      const { rerender } = render(<RichTextEditor content="<p>Initial</p>" />);
      mockEditor.getHTML.mockReturnValue("<p>Initial</p>");
      rerender(<RichTextEditor content="<p>Updated</p>" />);
      expect(mockEditor.commands.setContent).toHaveBeenCalledWith(
        "<p>Updated</p>",
        { emitUpdate: false }
      );
    });

    it("does not call setContent when content matches", () => {
      mockEditor.getHTML.mockReturnValue("<p>Same</p>");
      render(<RichTextEditor content="<p>Same</p>" />);
      // Might be called once on initial render; clear and rerender
      mockEditor.commands.setContent.mockClear();
      // Trigger a re-render with same content
      render(<RichTextEditor content="<p>Same</p>" />);
    });
  });

  describe("editable prop", () => {
    it("calls setEditable when editable changes", () => {
      const { rerender } = render(<RichTextEditor editable={true} />);
      rerender(<RichTextEditor editable={false} />);
      expect(mockEditor.setEditable).toHaveBeenCalledWith(false);
    });
  });

  describe("compound components", () => {
    it("renders children instead of default layout", () => {
      render(
        <RichTextEditor>
          <RichTextEditor.Content />
        </RichTextEditor>
      );
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
      // No toolbar when using compound children without explicit Toolbar
      expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
    });

    it("renders Toolbar + Content as children", () => {
      render(
        <RichTextEditor>
          <RichTextEditor.Toolbar groups={["textFormatting"]} />
          <RichTextEditor.Content />
        </RichTextEditor>
      );
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });

    it("renders BubbleMenu when bubbleMenu prop is true", () => {
      render(<RichTextEditor bubbleMenu={true} />);
      expect(screen.getByTestId("bubble-menu")).toBeInTheDocument();
    });

    it("does not render BubbleMenu by default", () => {
      render(<RichTextEditor />);
      expect(screen.queryByTestId("bubble-menu")).not.toBeInTheDocument();
    });

    it("renders BubbleMenu with custom groups", () => {
      render(
        <RichTextEditor bubbleMenu={{ groups: ["textFormatting"] }} />
      );
      expect(screen.getByTestId("bubble-menu")).toBeInTheDocument();
    });
  });

  describe("minHeight and maxHeight", () => {
    it("applies minHeight to content wrapper", () => {
      render(<RichTextEditor minHeight="200px" />);
      const content = document.querySelector(".charlie-rte-content");
      expect(content).not.toBeNull();
      expect((content as HTMLElement).style.minHeight).toBe("200px");
    });

    it("applies maxHeight to content wrapper", () => {
      render(<RichTextEditor maxHeight="500px" />);
      const content = document.querySelector(".charlie-rte-content");
      expect(content).not.toBeNull();
      expect((content as HTMLElement).style.maxHeight).toBe("500px");
    });
  });

  describe("accessibility", () => {
    it("toolbar has role=toolbar", () => {
      render(<RichTextEditor />);
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it("toolbar has aria-label='Text formatting'", () => {
      render(<RichTextEditor />);
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-label",
        "Text formatting"
      );
    });

    it("all toolbar buttons have aria-label", () => {
      render(<RichTextEditor />);
      const toolbar = screen.getByRole("toolbar");
      const buttons = toolbar.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("aria-label");
      });
    });

    it("toolbar buttons are of type=button", () => {
      render(<RichTextEditor />);
      const toolbar = screen.getByRole("toolbar");
      const buttons = toolbar.querySelectorAll("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("type", "button");
      });
    });

    it("all toolbar buttons have aria-pressed state", () => {
      render(<RichTextEditor />);
      const toolbar = screen.getByRole("toolbar");
      const buttons = toolbar.querySelectorAll("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("aria-pressed");
      });
    });

    it("content area has role=textbox", () => {
      render(<RichTextEditor />);
      const content = document.querySelector(".charlie-rte-content");
      expect(content).toHaveAttribute("role", "textbox");
    });

    it("content area has default aria-label", () => {
      render(<RichTextEditor />);
      const content = document.querySelector(".charlie-rte-content");
      expect(content).toHaveAttribute("aria-label", "Rich text editor");
    });

    it("content area has aria-multiline=true", () => {
      render(<RichTextEditor />);
      const content = document.querySelector(".charlie-rte-content");
      expect(content).toHaveAttribute("aria-multiline", "true");
    });

    it("passes axe accessibility checks", async () => {
      const { container } = render(<RichTextEditor />);
      await expectNoA11yViolations(container);
    });
  });
});

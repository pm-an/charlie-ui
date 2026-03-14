import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Drawer } from "../Drawer";
import { expectNoA11yViolations } from "../../test/a11y";

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: {
      div: React.forwardRef(
        (
          {
            initial,
            animate,
            exit,
            transition,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLDivElement>
        ) => <div ref={ref} {...props} />
      ),
    },
  };
});

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  children: <p>Drawer content</p>,
};

describe("Drawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset body overflow after each test
    document.body.style.overflow = "";
  });

  describe("rendering", () => {
    it("renders when open", () => {
      render(<Drawer {...defaultProps} title="Test Drawer" />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(<Drawer {...defaultProps} open={false} title="Test Drawer" />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<Drawer {...defaultProps} title="My Drawer" />);
      expect(screen.getByText("My Drawer")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <Drawer
          {...defaultProps}
          title="Title"
          description="Some description text"
        />
      );
      expect(screen.getByText("Some description text")).toBeInTheDocument();
    });

    it("renders close button by default", () => {
      render(<Drawer {...defaultProps} title="Test" />);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    it("hides close button when showClose is false", () => {
      render(<Drawer {...defaultProps} title="Test" showClose={false} />);
      expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
    });

    it("renders children content", () => {
      render(
        <Drawer {...defaultProps}>
          <span>Custom child content</span>
        </Drawer>
      );
      expect(screen.getByText("Custom child content")).toBeInTheDocument();
    });

    it("renders into a portal on document.body", () => {
      const { baseElement } = render(
        <Drawer {...defaultProps} title="Portal Test" />
      );
      // The dialog should be in the body, not in the container
      const dialog = baseElement.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe("sides", () => {
    it("renders right side by default", () => {
      render(<Drawer {...defaultProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("right-0", "top-0", "h-full");
    });

    it("renders left side", () => {
      render(<Drawer {...defaultProps} side="left" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("left-0", "top-0", "h-full");
    });

    it("renders top side", () => {
      render(<Drawer {...defaultProps} side="top" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("top-0", "left-0", "w-full");
    });

    it("renders bottom side", () => {
      render(<Drawer {...defaultProps} side="bottom" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("bottom-0", "left-0", "w-full");
    });
  });

  describe("sizes", () => {
    it("renders sm size for horizontal drawer", () => {
      render(<Drawer {...defaultProps} side="right" size="sm" />);
      expect(screen.getByRole("dialog")).toHaveClass("w-[320px]");
    });

    it("renders md size for horizontal drawer (default)", () => {
      render(<Drawer {...defaultProps} side="right" />);
      expect(screen.getByRole("dialog")).toHaveClass("w-[420px]");
    });

    it("renders lg size for horizontal drawer", () => {
      render(<Drawer {...defaultProps} side="right" size="lg" />);
      expect(screen.getByRole("dialog")).toHaveClass("w-[560px]");
    });

    it("renders full size for horizontal drawer", () => {
      render(<Drawer {...defaultProps} side="right" size="full" />);
      expect(screen.getByRole("dialog")).toHaveClass("w-screen");
    });

    it("renders sm size for vertical drawer", () => {
      render(<Drawer {...defaultProps} side="bottom" size="sm" />);
      expect(screen.getByRole("dialog")).toHaveClass("h-[240px]");
    });

    it("renders md size for vertical drawer", () => {
      render(<Drawer {...defaultProps} side="top" size="md" />);
      expect(screen.getByRole("dialog")).toHaveClass("h-[360px]");
    });

    it("renders lg size for vertical drawer", () => {
      render(<Drawer {...defaultProps} side="bottom" size="lg" />);
      expect(screen.getByRole("dialog")).toHaveClass("h-[480px]");
    });

    it("renders full size for vertical drawer", () => {
      render(<Drawer {...defaultProps} side="top" size="full" />);
      expect(screen.getByRole("dialog")).toHaveClass("h-screen");
    });
  });

  describe("interactions", () => {
    it("calls onClose when backdrop is clicked", () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId("drawer-backdrop"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape key is pressed", () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(<Drawer {...defaultProps} onClose={onClose} title="Test" />);
      fireEvent.click(screen.getByLabelText("Close"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render backdrop when overlay is false", () => {
      render(<Drawer {...defaultProps} overlay={false} />);
      expect(screen.queryByTestId("drawer-backdrop")).not.toBeInTheDocument();
    });

    it("still renders the panel when overlay is false", () => {
      render(<Drawer {...defaultProps} overlay={false} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("body scroll lock", () => {
    it("locks body scroll when open", () => {
      render(<Drawer {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when closed", () => {
      const { unmount } = render(<Drawer {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
      unmount();
      expect(document.body.style.overflow).toBe("");
    });

    it("does not lock body scroll when closed", () => {
      document.body.style.overflow = "auto";
      render(<Drawer {...defaultProps} open={false} />);
      expect(document.body.style.overflow).toBe("auto");
    });
  });

  describe("accessibility", () => {
    it("has dialog role", () => {
      render(<Drawer {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal set to true", () => {
      render(<Drawer {...defaultProps} />);
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "aria-modal",
        "true"
      );
    });

    it("has aria-labelledby linked to title", () => {
      render(<Drawer {...defaultProps} title="Accessible Drawer" />);
      const dialog = screen.getByRole("dialog");
      const labelId = dialog.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      const titleElement = document.getElementById(labelId!);
      expect(titleElement).toHaveTextContent("Accessible Drawer");
    });

    it("has aria-describedby linked to description", () => {
      render(
        <Drawer
          {...defaultProps}
          title="Title"
          description="Drawer description"
        />
      );
      const dialog = screen.getByRole("dialog");
      const descId = dialog.getAttribute("aria-describedby");
      expect(descId).toBeTruthy();
      const descElement = document.getElementById(descId!);
      expect(descElement).toHaveTextContent("Drawer description");
    });

    it("does not set aria-labelledby when no title", () => {
      render(<Drawer {...defaultProps} showClose={false} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("aria-labelledby");
    });

    it("does not set aria-describedby when no description", () => {
      render(<Drawer {...defaultProps} title="Title" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toHaveAttribute("aria-describedby");
    });

    it("close button has aria-label", () => {
      render(<Drawer {...defaultProps} title="Test" />);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });
  });

  describe("className merging", () => {
    it("applies custom className to the panel", () => {
      render(<Drawer {...defaultProps} className="custom-drawer-class" />);
      expect(screen.getByRole("dialog")).toHaveClass("custom-drawer-class");
    });

    it("merges custom className with default classes", () => {
      render(
        <Drawer {...defaultProps} className="custom-class" side="right" />
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("custom-class");
      expect(dialog).toHaveClass("right-0");
    });
  });

  describe("header rendering", () => {
    it("renders header when title is provided", () => {
      render(<Drawer {...defaultProps} title="Header Test" />);
      expect(screen.getByText("Header Test")).toBeInTheDocument();
    });

    it("renders header when showClose is true even without title", () => {
      render(<Drawer {...defaultProps} showClose={true} />);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    it("does not render header when no title and showClose is false", () => {
      const { container } = render(
        <Drawer {...defaultProps} showClose={false} />
      );
      // Header has border-b class, so check for its absence
      const header = container.querySelector(".border-b.border-white\\/10");
      expect(header).not.toBeInTheDocument();
    });

    it("title is rendered as h2", () => {
      render(<Drawer {...defaultProps} title="Heading Test" />);
      const heading = screen.getByText("Heading Test");
      expect(heading.tagName).toBe("H2");
    });
  });

  describe("focus management", () => {
    it("traps focus within the drawer (Tab cycles)", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Focus test">
          <button>First</button>
          <button>Second</button>
        </Drawer>
      );

      // Wait for auto-focus via useFocusTrap
      await new Promise((r) => requestAnimationFrame(r));

      const closeBtn = screen.getByLabelText("Close");
      const firstBtn = screen.getByRole("button", { name: "First" });
      const secondBtn = screen.getByRole("button", { name: "Second" });

      // useFocusTrap auto-focuses the first focusable (Close button)
      expect(document.activeElement).toBe(closeBtn);

      await user.tab();
      expect(document.activeElement).toBe(firstBtn);

      await user.tab();
      expect(document.activeElement).toBe(secondBtn);

      // Tab wraps back to Close
      await user.tab();
      expect(document.activeElement).toBe(closeBtn);

      // Shift+Tab wraps to Second
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(secondBtn);
    });

    it("returns focus to previously focused element on close", async () => {
      const triggerBtn = document.createElement("button");
      triggerBtn.textContent = "Trigger";
      document.body.appendChild(triggerBtn);
      triggerBtn.focus();
      expect(document.activeElement).toBe(triggerBtn);

      const onClose = vi.fn();
      const { rerender } = render(
        <Drawer open onClose={onClose} title="Return focus">
          <p>Content</p>
        </Drawer>
      );

      rerender(
        <Drawer open={false} onClose={onClose} title="Return focus">
          <p>Content</p>
        </Drawer>
      );

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(triggerBtn);
      });

      document.body.removeChild(triggerBtn);
    });
  });

  describe("axe accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { baseElement } = render(
        <Drawer
          open
          onClose={() => {}}
          title="Accessible Drawer"
          description="A helpful description"
        >
          <p>Content</p>
          <button>Action</button>
        </Drawer>
      );
      await expectNoA11yViolations(baseElement);
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Modal } from "../Modal";
import { expectNoA11yViolations } from "../../test/a11y";

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: {
      div: React.forwardRef(
        (
          {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            transition: _transition,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLDivElement>
        ) => <div ref={ref} {...props} />
      ),
    },
  };
});

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Modal", () => {
  it("renders when open is true", () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Modal open={false} onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Modal open onOpenChange={() => {}} title="My Title">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <Modal
        open
        onOpenChange={() => {}}
        title="Title"
        description="Some description"
      >
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("has dialog role with aria-modal", () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("sets aria-labelledby when title is provided", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Labeled Modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    const titleEl = document.getElementById(labelledBy!);
    expect(titleEl).toHaveTextContent("Labeled Modal");
  });

  it("does not set aria-labelledby when no title is provided", () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });

  it("sets aria-describedby when description is provided", () => {
    render(
      <Modal
        open
        onOpenChange={() => {}}
        title="Title"
        description="Help text"
      >
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const descEl = document.getElementById(describedBy!);
    expect(descEl).toHaveTextContent("Help text");
  });

  it("does not set aria-describedby when no description is provided", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Title">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("calls onOpenChange(false) on Escape key", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) on backdrop click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const backdrop = screen.getByTestId("modal-backdrop");
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders close button by default", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Test">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("hides close button when showClose is false", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Test" showClose={false}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) on close button click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Test">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies size variant sm", () => {
    render(
      <Modal open onOpenChange={() => {}} size="sm">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-[400px]");
  });

  it("applies custom className to the dialog panel", () => {
    render(
      <Modal open onOpenChange={() => {}} className="custom-class">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-class");
  });

  it("locks body scroll when open", () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  describe("focus management", () => {
    it("traps focus within the modal (Tab cycles)", async () => {
      const user = userEvent.setup();
      render(
        <Modal open onOpenChange={() => {}} title="Focus test">
          <Modal.Body>
            <button>First</button>
            <button>Second</button>
          </Modal.Body>
        </Modal>
      );

      // Focus should be auto-set into the modal. The close button is the first
      // focusable element. Tab through all elements and verify it cycles.
      // Modal.Body has tabIndex={0} so it's also in the focus order.
      const closeBtn = screen.getByRole("button", { name: "Close" });
      const firstBtn = screen.getByRole("button", { name: "First" });
      const secondBtn = screen.getByRole("button", { name: "Second" });

      // Focus close button (first focusable)
      closeBtn.focus();
      expect(document.activeElement).toBe(closeBtn);

      // Tab to Modal.Body (tabIndex=0 scrollable region)
      await user.tab();
      // Tab to First
      await user.tab();
      expect(document.activeElement).toBe(firstBtn);

      // Tab to Second
      await user.tab();
      expect(document.activeElement).toBe(secondBtn);

      // Tab wraps back to Close
      await user.tab();
      expect(document.activeElement).toBe(closeBtn);

      // Shift+Tab wraps to Second
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(secondBtn);
    });

    it("returns focus to the previously focused element on close", async () => {
      const triggerBtn = document.createElement("button");
      triggerBtn.textContent = "Trigger";
      document.body.appendChild(triggerBtn);
      triggerBtn.focus();
      expect(document.activeElement).toBe(triggerBtn);

      const { rerender } = render(
        <Modal open onOpenChange={() => {}} title="Return focus test">
          <Modal.Body>Modal content</Modal.Body>
        </Modal>
      );

      // Re-render with closed state to trigger focus return
      rerender(
        <Modal open={false} onOpenChange={() => {}} title="Return focus test">
          <Modal.Body>Modal content</Modal.Body>
        </Modal>
      );

      // useFocusReturn uses rAF, flush it
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(triggerBtn);
      });

      document.body.removeChild(triggerBtn);
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <Modal
        open
        onOpenChange={() => {}}
        title="Accessible Modal"
        description="A helpful description"
      >
        <Modal.Body>Body content</Modal.Body>
        <Modal.Footer>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    );
    await expectNoA11yViolations(container);
  });
});

describe("Modal.Header", () => {
  it("renders children", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Header>Header content</Modal.Header>
      </Modal>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });
});

describe("Modal.Body", () => {
  it("renders children", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Body>Body content</Modal.Body>
      </Modal>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});

describe("Modal.Footer", () => {
  it("renders children", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Footer>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});

describe("Modal (fullscreen)", () => {
  it("renders when open is true", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Fullscreen content</div>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Fullscreen content")).toBeInTheDocument();
  });

  it("has dialog role with aria-modal", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("calls onOpenChange(false) on Escape key", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} fullscreen>
        <div>Content</div>
      </Modal>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <Modal
        open
        onOpenChange={() => {}}
        fullscreen
        title="Fullscreen"
        description="Description"
      >
        <div>Content</div>
      </Modal>
    );
    await expectNoA11yViolations(container);
  });
});

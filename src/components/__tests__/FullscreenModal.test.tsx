import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { FullscreenModal } from "../FullscreenModal";
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

describe("FullscreenModal", () => {
  it("renders when open is true", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}} title="Settings">
        <FullscreenModal.Body>Body content</FullscreenModal.Body>
      </FullscreenModal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <FullscreenModal open={false} onOpenChange={() => {}}>
        <FullscreenModal.Body>Body content</FullscreenModal.Body>
      </FullscreenModal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <FullscreenModal
        open
        onOpenChange={() => {}}
        title="Settings"
        description="Manage your account"
      >
        <FullscreenModal.Body>Content</FullscreenModal.Body>
      </FullscreenModal>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
  });

  it("inherits focus trap from Modal (Tab cycles within)", async () => {
    const user = userEvent.setup();
    render(
      <FullscreenModal open onOpenChange={() => {}} title="Focus test">
        <FullscreenModal.Body>
          <button>First</button>
          <button>Second</button>
        </FullscreenModal.Body>
      </FullscreenModal>
    );

    const closeBtn = screen.getByRole("button", { name: "Close" });
    const firstBtn = screen.getByRole("button", { name: "First" });
    const secondBtn = screen.getByRole("button", { name: "Second" });

    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    await user.tab();
    expect(document.activeElement).toBe(firstBtn);

    await user.tab();
    expect(document.activeElement).toBe(secondBtn);

    // Tab wraps back to Close
    await user.tab();
    expect(document.activeElement).toBe(closeBtn);
  });

  it("inherits focus return from Modal", async () => {
    const triggerBtn = document.createElement("button");
    triggerBtn.textContent = "Trigger";
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();

    const { rerender } = render(
      <FullscreenModal open onOpenChange={() => {}} title="Return focus">
        <FullscreenModal.Body>Content</FullscreenModal.Body>
      </FullscreenModal>
    );

    rerender(
      <FullscreenModal open={false} onOpenChange={() => {}} title="Return focus">
        <FullscreenModal.Body>Content</FullscreenModal.Body>
      </FullscreenModal>
    );

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(triggerBtn);
    });

    document.body.removeChild(triggerBtn);
  });

  it("calls onOpenChange(false) on Escape key", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FullscreenModal open onOpenChange={onOpenChange}>
        <FullscreenModal.Body>Content</FullscreenModal.Body>
      </FullscreenModal>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uses fullscreen-modal data-slot", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <FullscreenModal.Body>Content</FullscreenModal.Body>
      </FullscreenModal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-slot", "fullscreen-modal");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <FullscreenModal
        open
        onOpenChange={() => {}}
        title="Accessible"
        description="Description"
      >
        <FullscreenModal.Body>Body content</FullscreenModal.Body>
        <FullscreenModal.Footer>
          <button>Save</button>
        </FullscreenModal.Footer>
      </FullscreenModal>
    );
    await expectNoA11yViolations(container);
  });
});

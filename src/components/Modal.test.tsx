import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

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
      <Modal open onOpenChange={() => {}} title="Title" description="Some description">
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
    // The referenced element should contain the title text
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
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
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

  it("applies size variant md (default)", () => {
    render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-[540px]");
  });

  it("applies size variant lg", () => {
    render(
      <Modal open onOpenChange={() => {}} size="lg">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-[640px]");
  });

  it("applies size variant xl", () => {
    render(
      <Modal open onOpenChange={() => {}} size="xl">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("max-w-[780px]");
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
    const { unmount } = render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
  });

  it("restores body scroll on close", () => {
    document.body.style.overflow = "";
    const { rerender } = render(
      <Modal open onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Modal open={false} onOpenChange={() => {}}>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("");
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

  it("applies custom className", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Header className="custom-header">Header</Modal.Header>
      </Modal>
    );
    // Modal.Header renders a div directly containing the text
    const headerEl = screen.getByText("Header");
    expect(headerEl).toHaveClass("custom-header");
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

  it("applies custom className", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Body className="custom-body">Body</Modal.Body>
      </Modal>
    );
    expect(screen.getByText("Body")).toHaveClass("custom-body");
  });

  it("has scrollable overflow", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Body>Scroll me</Modal.Body>
      </Modal>
    );
    expect(screen.getByText("Scroll me").className).toContain("overflow-y-auto");
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

  it("applies custom className", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Footer className="custom-footer">
          <button>Action</button>
        </Modal.Footer>
      </Modal>
    );
    const footer = screen.getByText("Action").closest("div");
    expect(footer).toHaveClass("custom-footer");
  });

  it("renders with flex justify-end layout", () => {
    render(
      <Modal open onOpenChange={() => {}} showClose={false}>
        <Modal.Footer>
          <button>Action</button>
        </Modal.Footer>
      </Modal>
    );
    const footer = screen.getByText("Action").closest("div");
    expect(footer?.className).toContain("justify-end");
    expect(footer?.className).toContain("gap-3");
  });
});

/* ─── Fullscreen mode ──────────────────────── */

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

  it("does not render when open is false", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} fullscreen>
        <div>Fullscreen content</div>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses fullscreen layout classes", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("inset-4");
    expect(dialog.className).toContain("flex");
    expect(dialog.className).toContain("flex-col");
    // Should NOT have size-based max-width classes
    expect(dialog.className).not.toContain("max-w-");
  });

  it("renders title and description", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen title="Settings" description="Manage preferences">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage preferences")).toBeInTheDocument();
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

  it("sets aria-labelledby when title is provided", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen title="My Title">
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    const heading = screen.getByText("My Title");
    expect(heading.id).toBe(labelledBy);
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

  it("calls onOpenChange(false) on backdrop click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} fullscreen>
        <div>Content</div>
      </Modal>
    );
    const backdrop = screen.getByTestId("fullscreen-modal-backdrop");
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders close button by default", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("hides close button when showClose is false", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen showClose={false}>
        <div>Content</div>
      </Modal>
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("applies custom className to the panel", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen className="custom-fs">
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-fs");
  });

  it("uses fullscreen-modal data-slot", () => {
    render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Content</div>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-slot", "fullscreen-modal");
  });

  it("locks body scroll when open", () => {
    const { unmount } = render(
      <Modal open onOpenChange={() => {}} fullscreen>
        <div>Content</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
  });
});

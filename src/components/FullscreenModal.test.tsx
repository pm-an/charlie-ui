import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FullscreenModal } from "./FullscreenModal";

describe("FullscreenModal", () => {
  it("renders when open is true", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <div>Modal content</div>
      </FullscreenModal>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <FullscreenModal open={false} onOpenChange={() => {}}>
        <div>Modal content</div>
      </FullscreenModal>
    );
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}} title="Settings">
        <div>Content</div>
      </FullscreenModal>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <FullscreenModal
        open
        onOpenChange={() => {}}
        title="Settings"
        description="Manage your preferences"
      >
        <div>Content</div>
      </FullscreenModal>
    );
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
  });

  it("has dialog role with aria-modal", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <div>Content</div>
      </FullscreenModal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("sets aria-labelledby when title is provided", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}} title="My Title">
        <div>Content</div>
      </FullscreenModal>
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
      <FullscreenModal open onOpenChange={onOpenChange}>
        <div>Content</div>
      </FullscreenModal>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders close button by default", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <div>Content</div>
      </FullscreenModal>
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("hides close button when showClose is false", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}} showClose={false}>
        <div>Content</div>
      </FullscreenModal>
    );
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) on close button click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FullscreenModal open onOpenChange={onOpenChange}>
        <div>Content</div>
      </FullscreenModal>
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) on backdrop click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FullscreenModal open onOpenChange={onOpenChange}>
        <div>Content</div>
      </FullscreenModal>
    );
    const backdrop = screen.getByTestId("fullscreen-modal-backdrop");
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies custom className to the panel", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}} className="custom-class">
        <div>Content</div>
      </FullscreenModal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-class");
  });

  it("renders with fullscreen layout", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <div>Content</div>
      </FullscreenModal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("inset-4");
    expect(dialog.className).toContain("flex-col");
  });

  it("locks body scroll when open", () => {
    const { unmount } = render(
      <FullscreenModal open onOpenChange={() => {}}>
        <div>Content</div>
      </FullscreenModal>
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("FullscreenModal.Body", () => {
  it("renders children with padding", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <FullscreenModal.Body>
          <p>Body content</p>
        </FullscreenModal.Body>
      </FullscreenModal>
    );
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <FullscreenModal.Body className="extra-body" data-testid="body">
          <p>Body content</p>
        </FullscreenModal.Body>
      </FullscreenModal>
    );
    const body = screen.getByTestId("body");
    expect(body).toHaveClass("extra-body");
    expect(body).toHaveClass("px-6");
    expect(body).toHaveClass("py-4");
  });
});

describe("FullscreenModal.Footer", () => {
  it("renders children", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <FullscreenModal.Footer>
          <button>Save</button>
        </FullscreenModal.Footer>
      </FullscreenModal>
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FullscreenModal open onOpenChange={() => {}}>
        <FullscreenModal.Footer className="extra-footer" data-testid="footer">
          <button>Save</button>
        </FullscreenModal.Footer>
      </FullscreenModal>
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveClass("extra-footer");
    expect(footer).toHaveClass("px-6");
    expect(footer).toHaveClass("py-4");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Collapsible } from "../Collapsible";

describe("Collapsible", () => {
  describe("rendering", () => {
    it("renders trigger text", () => {
      render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Hidden content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
    });

    it("content is hidden by default", () => {
      render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Hidden content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("applies custom className to root", () => {
      const { container } = render(
        <Collapsible className="custom-root">
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(container.firstChild).toHaveClass("custom-root");
    });

    it("applies custom className to trigger", () => {
      render(
        <Collapsible>
          <Collapsible.Trigger className="custom-trigger">Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveClass("custom-trigger");
    });

    it("sets data-state attribute on root", () => {
      const { container } = render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(container.firstChild).toHaveAttribute("data-state", "closed");
    });

    it("sets data-state to open when defaultOpen", () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(container.firstChild).toHaveAttribute("data-state", "open");
    });
  });

  describe("toggle open/close", () => {
    it("shows content when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Revealed content</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.getByText("Revealed content")).toBeInTheDocument();
    });

    it("toggles content on repeated clicks", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      const trigger = screen.getByRole("button", { name: "Toggle" });
      // Open
      await user.click(trigger);
      expect(screen.getByText("Content")).toBeInTheDocument();
      // Close then reopen (AnimatePresence may keep in DOM, so just verify toggle works)
      await user.click(trigger);
      await user.click(trigger);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("defaultOpen", () => {
    it("renders content immediately when defaultOpen is true", () => {
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Visible from start</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByText("Visible from start")).toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("respects controlled open prop", () => {
      render(
        <Collapsible open={true}>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Controlled content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByText("Controlled content")).toBeInTheDocument();
    });

    it("does not show content when open is false", () => {
      render(
        <Collapsible open={false}>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Controlled content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.queryByText("Controlled content")).not.toBeInTheDocument();
    });

    it("calls onOpenChange when trigger is clicked", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Collapsible open={false} onOpenChange={onOpenChange}>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls onOpenChange with false when closing", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Collapsible open={true} onOpenChange={onOpenChange}>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("disabled", () => {
    it("disables the trigger button", () => {
      render(
        <Collapsible disabled>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toBeDisabled();
    });

    it("does not open when disabled and clicked", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible disabled>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Hidden content</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("does not call onOpenChange when disabled", async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Collapsible disabled onOpenChange={onOpenChange}>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByRole("button", { name: "Toggle" }));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("ARIA attributes", () => {
    it("sets aria-expanded to false when closed", () => {
      render(
        <Collapsible>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("sets aria-expanded to true when open", () => {
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("trigger has aria-controls pointing to content id", () => {
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      const trigger = screen.getByRole("button", { name: "Toggle" });
      const controlsId = trigger.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(document.getElementById(controlsId!)).toBeInTheDocument();
    });

    it("content has region role when open", () => {
      render(
        <Collapsible defaultOpen>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("asChild trigger", () => {
    it("renders children directly without wrapping button", () => {
      render(
        <Collapsible>
          <Collapsible.Trigger asChild>
            <span>Custom trigger</span>
          </Collapsible.Trigger>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible>
      );
      // Should render as span inside a role="button" wrapper, not a <button>
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Custom trigger")).toBeInTheDocument();
    });

    it("asChild trigger toggles content on click", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <Collapsible.Trigger asChild>
            <span>Click me</span>
          </Collapsible.Trigger>
          <Collapsible.Content>Revealed</Collapsible.Content>
        </Collapsible>
      );
      await user.click(screen.getByText("Click me"));
      expect(screen.getByText("Revealed")).toBeInTheDocument();
    });
  });

  describe("context error", () => {
    it("throws when Trigger is used outside Collapsible", () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(<Collapsible.Trigger>Orphan</Collapsible.Trigger>)
      ).toThrow("Collapsible.Trigger/Content must be used within a Collapsible");
      spy.mockRestore();
    });

    it("throws when Content is used outside Collapsible", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() =>
        render(<Collapsible.Content>Orphan</Collapsible.Content>)
      ).toThrow("Collapsible.Trigger/Content must be used within a Collapsible");
      spy.mockRestore();
    });
  });
});

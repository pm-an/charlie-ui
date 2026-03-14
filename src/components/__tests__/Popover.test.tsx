import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Popover } from "../Popover";
import { expectNoA11yViolations } from "../../test/a11y";

describe("Popover", () => {
  it("renders trigger", () => {
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Content</Popover.Content>
      </Popover>
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("content is hidden by default", () => {
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Popover content</Popover.Content>
      </Popover>
    );
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  });

  it("opens content on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Popover content</Popover.Content>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Escape content</Popover.Content>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Escape content")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    // After Escape the state is set to closed. Verify by reopening.
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Escape content")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Outside content</Popover.Content>
        </Popover>
        <button>External</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Outside content")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole("button", { name: "External" }));
    // State closed. Verify by re-opening.
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Outside content")).toBeInTheDocument();
  });

  it("Popover.Close closes the popover", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Close content</p>
          <Popover.Close>Done</Popover.Close>
        </Popover.Content>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Close content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    // Verify by reopening
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Close content")).toBeInTheDocument();
  });

  describe("ARIA attributes", () => {
    it("trigger has aria-expanded=false when closed", () => {
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("trigger has aria-expanded=true when open", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("trigger has aria-haspopup=dialog", () => {
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover>
      );
      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("content has role dialog", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Dialog content</Popover.Content>
        </Popover>
      );
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("focus management", () => {
    it("moves focus into popover on open", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>
            <button>Inside button</button>
          </Popover.Content>
        </Popover>
      );
      await user.click(screen.getByRole("button", { name: "Open" }));

      // Wait for rAF-based focus
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(
          screen.getByRole("button", { name: "Inside button" })
        );
      });
    });

    it("returns focus to trigger on close", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>
            <button>Inside</button>
            <Popover.Close>Done</Popover.Close>
          </Popover.Content>
        </Popover>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);

      // Close the popover
      await user.click(screen.getByRole("button", { name: "Done" }));

      // Focus should return to trigger via useFocusReturn + rAF
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });
  });

  describe("trapFocus prop", () => {
    it("traps focus within popover when trapFocus is true", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content trapFocus>
            <button>First</button>
            <button>Second</button>
          </Popover.Content>
        </Popover>
      );
      await user.click(screen.getByRole("button", { name: "Open" }));

      const firstBtn = screen.getByRole("button", { name: "First" });
      const secondBtn = screen.getByRole("button", { name: "Second" });

      // Auto-focus first focusable
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(firstBtn);
      });

      // Tab to second
      await user.tab();
      expect(document.activeElement).toBe(secondBtn);

      // Tab wraps to first
      await user.tab();
      expect(document.activeElement).toBe(firstBtn);
    });
  });

  describe("dismissible prop", () => {
    it("does not close on Escape when dismissible=false", async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content dismissible={false}>
            Non-dismissible
          </Popover.Content>
        </Popover>
      );
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Non-dismissible")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.getByText("Non-dismissible")).toBeInTheDocument();
    });
  });

  it("applies custom className to content", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content className="custom-popover">
          Content
        </Popover.Content>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("custom-popover");
  });

  it("throws when compound components are used outside Popover", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Popover.Trigger>Orphan</Popover.Trigger>)).toThrow(
      "Popover compound components must be used within <Popover>"
    );
    consoleSpy.mockRestore();
  });

  it("passes axe accessibility checks", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Popover dialog">
          <p>Accessible content</p>
          <button>Action</button>
        </Popover.Content>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await expectNoA11yViolations(container);
  });
});

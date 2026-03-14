import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ContextMenu } from "../ContextMenu";
import { expectNoA11yViolations } from "../../test/a11y";

describe("ContextMenu", () => {
  it("renders trigger content", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click area</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    expect(screen.getByText("Right-click area")).toBeInTheDocument();
  });

  it("menu is closed by default", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Trigger</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on right-click at cursor position", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 200, clientY: 150 });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("positions menu at cursor coordinates", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 250, clientY: 300 });
    const menu = screen.getByRole("menu");
    expect(menu.style.top).toBe("300px");
    expect(menu.style.left).toBe("250px");
  });

  it("prevents default context menu", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });
    const prevented = !trigger.dispatchEvent(event);
    expect(prevented).toBe(true);
  });

  it("closes on outside click", async () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ContextMenu>
          <ContextMenu.Trigger>
            <div>Right-click here</div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Action</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("fires onSelect when item is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onSelect}>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    fireEvent.click(screen.getByText("Action"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("closes menu after item selection", async () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    fireEvent.click(screen.getByText("Action"));
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("renders separator", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Above</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Below</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>Section</ContextMenu.Label>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("renders shortcut text", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item shortcut="Cmd+C">Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    expect(screen.getByText("Cmd+C")).toBeInTheDocument();
  });

  it("disabled items are not interactive", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item disabled onSelect={onSelect}>
            Disabled
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    const item = screen.getByRole("menuitem");
    expect(item).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("destructive items have correct styling", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item destructive>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    const item = screen.getByRole("menuitem");
    expect(item).toHaveClass("text-red-400");
  });

  it("checkbox item toggles", () => {
    const onCheckedChange = vi.fn();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Toggle
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    fireEvent.click(screen.getByText("Toggle"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("radio items update selection", () => {
    const onValueChange = vi.fn();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioGroup value="a" onValueChange={onValueChange}>
            <ContextMenu.RadioItem value="a">Option A</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="b">Option B</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    const radioA = screen.getByRole("menuitemradio", { name: "Option A" });
    const radioB = screen.getByRole("menuitemradio", { name: "Option B" });
    expect(radioA).toHaveAttribute("aria-checked", "true");
    expect(radioB).toHaveAttribute("aria-checked", "false");
    fireEvent.click(radioB);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("keyboard navigation moves through items", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>First</ContextMenu.Item>
          <ContextMenu.Item>Second</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    await user.keyboard("{ArrowDown}");
    const items = screen.getAllByRole("menuitem");
    expect(items[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();
  });

  it("merges custom className on trigger", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger className="custom-trigger">
          <div>Content</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Content").parentElement;
    expect(trigger).toHaveClass("custom-trigger");
  });

  it("opens on Shift+F10 keyboard shortcut", async () => {
    const _user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click or keyboard</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click or keyboard").parentElement!;
    // Focus the trigger
    trigger.focus();
    // Press Shift+F10
    fireEvent.keyDown(trigger, { key: "F10", shiftKey: true });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("trigger has tabIndex for keyboard accessibility", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Content</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Content").parentElement;
    expect(trigger).toHaveAttribute("tabindex", "0");
  });

  it("passes axe accessibility checks when open", async () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenu.Trigger>
          <div>Right-click here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
          <ContextMenu.Item>Paste</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    const trigger = screen.getByText("Right-click here");
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 });
    await expectNoA11yViolations(container);
  });
});

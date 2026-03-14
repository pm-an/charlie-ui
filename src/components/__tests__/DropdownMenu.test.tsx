import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DropdownMenu } from "../DropdownMenu";

describe("DropdownMenu", () => {
  it("renders trigger", () => {
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("menu is closed by default", () => {
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // mousedown on outside area triggers close
    fireEvent.mouseDown(screen.getByTestId("outside"));
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("fires onSelect when item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect}>Action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Action"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("closes menu after item click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Action"));
    // AnimatePresence exit animation may keep element briefly in DOM
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("checkbox item toggles checked state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Toggle Me
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Toggle Me"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("checkbox item renders check icon when checked", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked>Checked Item</DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const checkbox = screen.getByRole("menuitemcheckbox");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("checkbox item has aria-checked=false when unchecked", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked={false}>Unchecked Item</DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const checkbox = screen.getByRole("menuitemcheckbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("radio items update selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup value="a" onValueChange={onValueChange}>
            <DropdownMenu.RadioItem value="a">Option A</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="b">Option B</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const radioA = screen.getByRole("menuitemradio", { name: "Option A" });
    const radioB = screen.getByRole("menuitemradio", { name: "Option B" });
    expect(radioA).toHaveAttribute("aria-checked", "true");
    expect(radioB).toHaveAttribute("aria-checked", "false");
    await user.click(radioB);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("keyboard navigation moves through items with ArrowDown", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First</DropdownMenu.Item>
          <DropdownMenu.Item>Second</DropdownMenu.Item>
          <DropdownMenu.Item>Third</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    await user.keyboard("{ArrowDown}");
    // First item should be focused
    const items = screen.getAllByRole("menuitem");
    expect(items[0]).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();
  });

  it("keyboard navigation wraps around", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First</DropdownMenu.Item>
          <DropdownMenu.Item>Second</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    // Navigate past the end
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    // Should wrap to first
    const items = screen.getAllByRole("menuitem");
    expect(items[0]).toHaveFocus();
  });

  it("disabled items are not interactive", async () => {
    const _user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item disabled onSelect={onSelect}>
            Disabled
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const item = screen.getByRole("menuitem");
    expect(item).toHaveAttribute("aria-disabled", "true");
    // pointer-events-none prevents actual clicks in browser; in jsdom
    // we verify the handler guards against it
    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("destructive items have correct styling", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item destructive>Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const item = screen.getByRole("menuitem");
    expect(item).toHaveClass("text-red-400");
  });

  it("displays shortcut text", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item shortcut="Cmd+C">Copy</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByText("Cmd+C")).toBeInTheDocument();
  });

  it("renders separator with role", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Above</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Below</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Group Title</DropdownMenu.Label>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByText("Group Title")).toBeInTheDocument();
  });

  it("merges custom className on items", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="custom-class">Styled</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByRole("menuitem")).toHaveClass("custom-class");
  });

  it("trigger has aria-expanded and aria-haspopup", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("controlled open state works via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu open={false} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders icon in menu item", () => {
    const Icon = () => <svg data-testid="test-icon" />;
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<Icon />}>With Icon</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("skips disabled items during keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>First</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
          <DropdownMenu.Item>Third</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
    await user.click(screen.getByText("Open"));
    // The disabled item has data-disabled="true" so it's excluded from keyboard nav
    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("First").closest("[data-menu-item]")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    // Should skip disabled and go to Third
    expect(screen.getByText("Third").closest("[data-menu-item]")).toHaveFocus();
  });
});

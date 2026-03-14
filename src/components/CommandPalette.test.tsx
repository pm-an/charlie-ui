import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CommandPalette, CommandGroup, CommandItem } from "./CommandPalette";

describe("CommandPalette", () => {
  it("does not render when closed", () => {
    render(
      <CommandPalette open={false} onOpenChange={() => {}}>
        <div>Items</div>
      </CommandPalette>
    );
    expect(screen.queryByText("Items")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(
      <CommandPalette open onOpenChange={() => {}}>
        <div>Items</div>
      </CommandPalette>
    );
    expect(screen.getByText("Items")).toBeInTheDocument();
  });

  it("renders search input with default placeholder", () => {
    render(
      <CommandPalette open onOpenChange={() => {}}>
        <div>Items</div>
      </CommandPalette>
    );
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders search input with custom placeholder", () => {
    render(
      <CommandPalette open onOpenChange={() => {}} placeholder="Type a command...">
        <div>Items</div>
      </CommandPalette>
    );
    expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) on backdrop click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open onOpenChange={onOpenChange}>
        <div>Items</div>
      </CommandPalette>
    );
    // Click the backdrop (first motion.div with bg-black/60)
    const backdrop = document.querySelector(".bg-black\\/60") as HTMLElement;
    if (backdrop) {
      await user.click(backdrop);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it("calls onOpenChange(false) on Escape key", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open onOpenChange={onOpenChange}>
        <div>Items</div>
      </CommandPalette>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("CommandGroup", () => {
  it("renders label", () => {
    render(<CommandGroup label="Recent">items</CommandGroup>);
    expect(screen.getByText("Recent")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<CommandGroup>Group content</CommandGroup>);
    expect(screen.getByText("Group content")).toBeInTheDocument();
  });
});

describe("CommandItem", () => {
  it("renders children", () => {
    render(<CommandItem>Search files</CommandItem>);
    expect(screen.getByText("Search files")).toBeInTheDocument();
  });

  it("has option role", () => {
    render(<CommandItem>Item</CommandItem>);
    expect(screen.getByRole("option")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CommandItem onSelect={onSelect}>Item</CommandItem>);
    await user.click(screen.getByText("Item"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("marks active item with aria-selected", () => {
    render(<CommandItem active>Active</CommandItem>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "true");
  });

  it("non-active item has aria-selected=false", () => {
    render(<CommandItem>Inactive</CommandItem>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "false");
  });

  it("renders shortcut hint", () => {
    render(<CommandItem shortcut="⌘K">Search</CommandItem>);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("disabled item does not fire onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CommandItem onSelect={onSelect} disabled>Item</CommandItem>);
    await user.click(screen.getByText("Item"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("CommandPalette search", () => {
  it("calls onSearch when typing in input", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <CommandPalette open onOpenChange={() => {}} onSearch={onSearch}>
        <CommandItem>Dashboard</CommandItem>
      </CommandPalette>
    );
    await user.type(screen.getByPlaceholderText("Search..."), "dash");
    expect(onSearch).toHaveBeenCalledWith("d");
    expect(onSearch).toHaveBeenCalledWith("da");
    expect(onSearch).toHaveBeenCalledWith("das");
    expect(onSearch).toHaveBeenCalledWith("dash");
  });

  it("filters items client-side by default", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette open onOpenChange={() => {}}>
        <CommandItem>Dashboard</CommandItem>
        <CommandItem>Settings</CommandItem>
        <CommandItem>Profile</CommandItem>
      </CommandPalette>
    );
    await user.type(screen.getByPlaceholderText("Search..."), "dash");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("matches against keywords", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette open onOpenChange={() => {}}>
        <CommandItem keywords={["preferences", "config"]}>Settings</CommandItem>
        <CommandItem>Dashboard</CommandItem>
      </CommandPalette>
    );
    await user.type(screen.getByPlaceholderText("Search..."), "config");
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("shows empty message when no items match", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette open onOpenChange={() => {}} emptyMessage="Nothing found.">
        <CommandItem>Dashboard</CommandItem>
      </CommandPalette>
    );
    await user.type(screen.getByPlaceholderText("Search..."), "zzzzz");
    expect(screen.getByText("Nothing found.")).toBeInTheDocument();
  });

  it("does not filter when filter=false (server-side mode)", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette open onOpenChange={() => {}} filter={false}>
        <CommandItem>Dashboard</CommandItem>
        <CommandItem>Settings</CommandItem>
      </CommandPalette>
    );
    await user.type(screen.getByPlaceholderText("Search..."), "dash");
    // Both items should still be visible since filtering is off
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("shows loading spinner when loading", () => {
    render(
      <CommandPalette open onOpenChange={() => {}} loading>
        <CommandItem>Item</CommandItem>
      </CommandPalette>
    );
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("uses controlled search value", () => {
    render(
      <CommandPalette open onOpenChange={() => {}} search="hello">
        <CommandItem>Item</CommandItem>
      </CommandPalette>
    );
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("hello");
  });
});

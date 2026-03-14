import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  it("renders trigger", () => {
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("menu is hidden by default", () => {
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes menu on second trigger click (toggle)", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes menu on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes menu on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <Dropdown>
          <Dropdown.Trigger>Open</Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("renders menu items", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>First</Dropdown.Item>
          <Dropdown.Item>Second</Dropdown.Item>
          <Dropdown.Item>Third</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("calls onSelect when item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item onSelect={onSelect}>Click me</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Click me"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes menu after item select", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item onSelect={() => {}}>Click me</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.click(screen.getByText("Click me"));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("renders separator", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Above</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Below</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders label", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Label>Group Title</Dropdown.Label>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Group Title")).toBeInTheDocument();
  });

  it("disabled item is not clickable", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item onSelect={onSelect} disabled>
            Disabled
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    // pointer-events-none prevents userEvent clicks; use fireEvent as fallback
    fireEvent.click(screen.getByText("Disabled"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("applies destructive styling", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item destructive>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    const item = screen.getByText("Delete").closest("[role='menuitem']");
    expect(item).toHaveClass("text-[#f87171]");
  });

  it("menu has role='menu'", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("items have role='menuitem'", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>First</Dropdown.Item>
          <Dropdown.Item>Second</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    await user.click(screen.getByText("Open"));
    const items = screen.getAllByRole("menuitem");
    expect(items).toHaveLength(2);
  });
});

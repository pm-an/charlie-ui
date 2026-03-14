import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Toggle } from "./Toggle";

// Toggle is now a re-export of Switch — these tests verify backward compatibility.

describe("Toggle", () => {
  it("renders as a switch", () => {
    render(<Toggle />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("has correct aria-checked when unchecked", () => {
    render(<Toggle checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("has correct aria-checked when checked", () => {
    render(<Toggle checked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with toggled value on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when checked is true", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle checked onChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Toggle disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("does not call onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle disabled onChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    render(<Toggle className="custom" />);
    expect(screen.getByRole("switch")).toHaveClass("custom");
  });

  it("works in uncontrolled mode with defaultChecked", async () => {
    const user = userEvent.setup();
    render(<Toggle defaultChecked={false} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("works in uncontrolled mode with defaultChecked=true", () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle defaultChecked={false} onChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("has data-state attribute", () => {
    render(<Toggle checked />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("has data-state=unchecked when not checked", () => {
    render(<Toggle checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("has data-slot=switch attribute (Toggle is now Switch)", () => {
    const { container } = render(<Toggle />);
    expect(container.querySelector("[data-slot='switch']")).toBeInTheDocument();
  });

  it("supports label prop (inherited from Switch)", () => {
    render(<Toggle label="Dark mode" />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("supports size prop (inherited from Switch)", () => {
    render(<Toggle size="sm" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveClass("h-5", "w-9");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToggleGroup } from "./ToggleGroup";

describe("ToggleGroup", () => {
  const options = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
    { label: "Lifetime", value: "lifetime" },
  ];

  it("renders all options", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
    expect(screen.getByText("Lifetime")).toBeInTheDocument();
  });

  it("renders as a radiogroup", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("marks active option as checked", () => {
    render(<ToggleGroup options={options} value="yearly" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    const yearlyRadio = radios.find((r) => r.textContent?.includes("Yearly"));
    expect(yearlyRadio).toHaveAttribute("aria-checked", "true");
  });

  it("marks non-active options as unchecked", () => {
    render(<ToggleGroup options={options} value="yearly" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    const monthlyRadio = radios.find((r) => r.textContent?.includes("Monthly"));
    expect(monthlyRadio).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange when an option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="monthly" onChange={onChange} />);
    await user.click(screen.getByText("Yearly"));
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  it("merges custom className", () => {
    const { container } = render(
      <ToggleGroup options={options} value="monthly" onChange={() => {}} className="custom" />
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("works in uncontrolled mode with defaultValue", () => {
    render(<ToggleGroup options={options} defaultValue="yearly" />);
    const radios = screen.getAllByRole("radio");
    const yearlyRadio = radios.find((r) => r.textContent?.includes("Yearly"));
    expect(yearlyRadio).toHaveAttribute("aria-checked", "true");
  });

  it("defaults to first option when no value or defaultValue", () => {
    render(<ToggleGroup options={options} />);
    const radios = screen.getAllByRole("radio");
    const monthlyRadio = radios.find((r) => r.textContent?.includes("Monthly"));
    expect(monthlyRadio).toHaveAttribute("aria-checked", "true");
  });

  it("switches options in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<ToggleGroup options={options} defaultValue="monthly" />);
    await user.click(screen.getByText("Yearly"));
    const yearlyRadio = screen.getAllByRole("radio").find((r) => r.textContent?.includes("Yearly"));
    expect(yearlyRadio).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} defaultValue="monthly" onChange={onChange} />);
    await user.click(screen.getByText("Yearly"));
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  it("has data-state on option buttons", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    const activeRadio = radios.find((r) => r.textContent?.includes("Monthly"));
    const inactiveRadio = radios.find((r) => r.textContent?.includes("Yearly"));
    expect(activeRadio).toHaveAttribute("data-state", "active");
    expect(inactiveRadio).toHaveAttribute("data-state", "inactive");
  });

  it("has data-slot on radiogroup", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-slot", "toggle-group");
  });
});

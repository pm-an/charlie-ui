import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToggleGroup } from "../ToggleGroup";
import { Field } from "../Field";
import { expectNoA11yViolations } from "../../test/a11y";

// Simple SVG icon stub for testing
const TestIcon = () => <svg data-testid="test-icon" />;

describe("ToggleGroup", () => {
  const options = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
    { label: "Lifetime", value: "lifetime" },
  ];

  // --- Rendering ---

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

  it("renders all items as radio buttons", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  // --- Active state ---

  it("marks active option as checked", () => {
    render(<ToggleGroup options={options} value="yearly" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Yearly/i })).toHaveAttribute("aria-checked", "true");
  });

  it("marks non-active options as unchecked", () => {
    render(<ToggleGroup options={options} value="yearly" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Monthly/i })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: /Lifetime/i })).toHaveAttribute("aria-checked", "false");
  });

  it("has data-state active/inactive on buttons", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Monthly/i })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("radio", { name: /Yearly/i })).toHaveAttribute("data-state", "inactive");
  });

  // --- Controlled mode ---

  it("calls onChange when an option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="monthly" onChange={onChange} />);
    await user.click(screen.getByText("Yearly"));
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  // --- Uncontrolled mode ---

  it("works in uncontrolled mode with defaultValue", () => {
    render(<ToggleGroup options={options} defaultValue="yearly" />);
    expect(screen.getByRole("radio", { name: /Yearly/i })).toHaveAttribute("aria-checked", "true");
  });

  it("defaults to first option when no value or defaultValue", () => {
    render(<ToggleGroup options={options} />);
    expect(screen.getByRole("radio", { name: /Monthly/i })).toHaveAttribute("aria-checked", "true");
  });

  it("switches options in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<ToggleGroup options={options} defaultValue="monthly" />);
    await user.click(screen.getByText("Yearly"));
    expect(screen.getByRole("radio", { name: /Yearly/i })).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} defaultValue="monthly" onChange={onChange} />);
    await user.click(screen.getByText("Yearly"));
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  // --- className & data attributes ---

  it("merges custom className", () => {
    const { container } = render(
      <ToggleGroup options={options} value="monthly" onChange={() => {}} className="custom" />
    );
    expect(container.firstChild).toHaveClass("custom");
  });

  it("has data-slot on radiogroup", () => {
    render(<ToggleGroup options={options} value="monthly" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-slot", "toggle-group");
  });

  it("passes additional HTML attributes to the root element", () => {
    render(
      <ToggleGroup options={options} value="monthly" onChange={() => {}} aria-label="Billing period" />
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Billing period");
  });

  // --- Roving tabindex ---

  it("only selected radio has tabIndex 0, others have -1", () => {
    render(<ToggleGroup options={options} value="yearly" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /Monthly/i })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("radio", { name: /Yearly/i })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: /Lifetime/i })).toHaveAttribute("tabindex", "-1");
  });

  // --- Keyboard navigation ---

  it("navigates to next option with ArrowRight", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="monthly" onChange={onChange} aria-label="Billing" />);
    const firstRadio = screen.getByRole("radio", { name: /Monthly/i });
    firstRadio.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  it("navigates to previous option with ArrowLeft", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="yearly" onChange={onChange} aria-label="Billing" />);
    const radio = screen.getByRole("radio", { name: /Yearly/i });
    radio.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith("monthly");
  });

  it("wraps around with ArrowRight on last option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="lifetime" onChange={onChange} aria-label="Billing" />);
    const radio = screen.getByRole("radio", { name: /Lifetime/i });
    radio.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("monthly");
  });

  it("wraps around with ArrowLeft on first option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="monthly" onChange={onChange} aria-label="Billing" />);
    const radio = screen.getByRole("radio", { name: /Monthly/i });
    radio.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith("lifetime");
  });

  it("navigates to first option with Home", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="lifetime" onChange={onChange} aria-label="Billing" />);
    const radio = screen.getByRole("radio", { name: /Lifetime/i });
    radio.focus();
    await user.keyboard("{Home}");
    expect(onChange).toHaveBeenCalledWith("monthly");
  });

  it("navigates to last option with End", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleGroup options={options} value="monthly" onChange={onChange} aria-label="Billing" />);
    const radio = screen.getByRole("radio", { name: /Monthly/i });
    radio.focus();
    await user.keyboard("{End}");
    expect(onChange).toHaveBeenCalledWith("lifetime");
  });

  // --- Icons ---

  it("renders icon when provided", () => {
    const withIcon = [
      { label: "Grid", value: "grid", icon: <TestIcon /> },
      { label: "List", value: "list" },
    ];
    render(<ToggleGroup options={withIcon} value="grid" onChange={() => {}} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("marks the icon wrapper as aria-hidden", () => {
    const withIcon = [
      { label: "Grid", value: "grid", icon: <TestIcon /> },
    ];
    render(<ToggleGroup options={withIcon} value="grid" onChange={() => {}} />);
    const iconWrapper = screen.getByTestId("test-icon").parentElement;
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render icon wrapper when icon is not provided", () => {
    const noIcon = [{ label: "Grid", value: "grid" }];
    render(<ToggleGroup options={noIcon} value="grid" onChange={() => {}} />);
    const button = screen.getByRole("radio");
    // Button should only contain the text, no icon span
    expect(button.querySelector("[aria-hidden]")).toBeNull();
  });

  it("renders both icon and label together", () => {
    const withIcon = [
      { label: "Grid", value: "grid", icon: <TestIcon /> },
    ];
    render(<ToggleGroup options={withIcon} value="grid" onChange={() => {}} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Grid")).toBeInTheDocument();
  });

  // --- Disabled ---

  it("disables a single option", () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /B/i })).toBeDisabled();
  });

  it("sets aria-disabled on disabled options", () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /B/i })).toHaveAttribute("aria-disabled", "true");
  });

  it("does not set aria-disabled on enabled options", () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /A/i })).not.toHaveAttribute("aria-disabled");
  });

  it("does not call onChange when clicking a disabled option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={onChange} />);
    await user.click(screen.getByText("B"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies reduced opacity to disabled options", () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /B/i })).toHaveClass("opacity-40");
  });

  it("applies cursor-not-allowed to disabled options", () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /B/i })).toHaveClass("cursor-not-allowed");
  });

  it("allows clicking non-disabled options when some are disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
      { label: "C", value: "c" },
    ];
    render(<ToggleGroup options={withDisabled} value="a" onChange={onChange} />);
    await user.click(screen.getByText("C"));
    expect(onChange).toHaveBeenCalledWith("c");
  });

  // --- Icons + Disabled combined ---

  it("renders icon on a disabled option", () => {
    const opts = [
      { label: "Premium", value: "premium", icon: <TestIcon />, disabled: true },
    ];
    render(<ToggleGroup options={opts} value="" onChange={() => {}} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Premium/i })).toBeDisabled();
  });

  // --- Field-aware behavior ---

  describe("ToggleGroup inside Field", () => {
    it("renders with Field label and error", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <ToggleGroup options={options} value="monthly" onChange={() => {}} />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      // The component options should still render
      expect(screen.getByText("Monthly")).toBeInTheDocument();
      expect(screen.getByText("Yearly")).toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(
        <ToggleGroup options={options} value="monthly" onChange={() => {}} />
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
      expect(screen.getByText("Monthly")).toBeInTheDocument();
    });
  });

  // --- Accessibility (axe) ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ToggleGroup
        options={options}
        value="monthly"
        onChange={() => {}}
        aria-label="Billing period"
      />
    );
    await expectNoA11yViolations(container);
  });

  it("has no accessibility violations with disabled options", async () => {
    const withDisabled = [
      { label: "A", value: "a" },
      { label: "B", value: "b", disabled: true },
      { label: "C", value: "c" },
    ];
    const { container } = render(
      <ToggleGroup
        options={withDisabled}
        value="a"
        onChange={() => {}}
        aria-label="Options"
      />
    );
    await expectNoA11yViolations(container);
  });
});

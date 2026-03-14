import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DateRangePicker } from "../DateRangePicker";
import { Field } from "../Field";
import { format, addDays } from "date-fns";
import { expectNoA11yViolations } from "../../test/a11y";

describe("DateRangePicker", () => {
  describe("rendering", () => {
    it("renders the trigger button", () => {
      render(<DateRangePicker />);
      expect(
        screen.getByTestId("daterangepicker-trigger")
      ).toBeInTheDocument();
    });

    it("shows default placeholder text", () => {
      render(<DateRangePicker />);
      expect(screen.getByText("Select date range")).toBeInTheDocument();
    });

    it("shows custom placeholder text", () => {
      render(<DateRangePicker placeholder="Choose dates..." />);
      expect(screen.getByText("Choose dates...")).toBeInTheDocument();
    });

    it("renders with a label", () => {
      render(<DateRangePicker label="Booking dates" />);
      expect(screen.getByText("Booking dates")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<DateRangePicker label="Date" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(<DateRangePicker helperText="Pick a range" />);
      expect(screen.getByText("Pick a range")).toBeInTheDocument();
    });

    it("applies custom className to trigger", () => {
      render(<DateRangePicker className="custom-class" />);
      expect(screen.getByTestId("daterangepicker-trigger")).toHaveClass(
        "custom-class"
      );
    });

    it("renders combobox role on trigger", () => {
      render(<DateRangePicker />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens calendar on click", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      expect(
        screen.getByTestId("daterangepicker-popover")
      ).toBeInTheDocument();
    });

    it("sets aria-expanded to true when open", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("closes calendar on second click of trigger", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      const trigger = screen.getByTestId("daterangepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on click outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <DateRangePicker />
          <button>Outside</button>
        </div>
      );
      const trigger = screen.getByTestId("daterangepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      fireEvent.mouseDown(screen.getByText("Outside"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      const trigger = screen.getByTestId("daterangepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("range selection", () => {
    it("selects a date range by clicking two dates", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateRangePicker onChange={onChange} numberOfMonths={1} />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));

      // Find and click day 10 (start)
      const dayButtons = screen.getAllByRole("gridcell");
      const day10 = dayButtons.find((cell) => {
        const button = cell.querySelector("button");
        return button?.textContent === "10";
      });
      expect(day10).toBeDefined();
      const dayButton10 = day10!.querySelector("button");
      if (dayButton10) {
        await user.click(dayButton10);
      }

      // First click sets "from" only, onChange is called
      expect(onChange).toHaveBeenCalled();
      const firstCall = onChange.mock.calls[0][0];
      expect(firstCall.from).toBeInstanceOf(Date);
      expect(firstCall.from.getDate()).toBe(10);

      // Find and click day 20 (end)
      const day20 = dayButtons.find((cell) => {
        const button = cell.querySelector("button");
        return button?.textContent === "20";
      });
      expect(day20).toBeDefined();
      const dayButton20 = day20!.querySelector("button");
      if (dayButton20) {
        await user.click(dayButton20);
      }

      // Second click sets both from and to
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.from).toBeInstanceOf(Date);
      expect(lastCall.to).toBeInstanceOf(Date);
    });

    it("displays formatted range when value has from and to", () => {
      const from = new Date(2026, 2, 1);
      const to = new Date(2026, 2, 14);
      render(<DateRangePicker value={{ from, to }} />);
      expect(
        screen.getByText(
          `${format(from, "MMM d, yyyy")} \u2013 ${format(to, "MMM d, yyyy")}`
        )
      ).toBeInTheDocument();
    });

    it("displays partial range with ellipsis when only from is set", () => {
      const from = new Date(2026, 2, 1);
      render(<DateRangePicker value={{ from }} />);
      expect(
        screen.getByText(`${format(from, "MMM d, yyyy")} \u2013 ...`)
      ).toBeInTheDocument();
    });

    it("uses custom date format", () => {
      const from = new Date(2026, 2, 1);
      const to = new Date(2026, 2, 14);
      render(
        <DateRangePicker
          value={{ from, to }}
          dateFormat="yyyy-MM-dd"
        />
      );
      expect(
        screen.getByText("2026-03-01 \u2013 2026-03-14")
      ).toBeInTheDocument();
    });
  });

  describe("clear button", () => {
    it("shows clear button when value is set", () => {
      render(
        <DateRangePicker
          value={{ from: new Date(2026, 2, 1), to: new Date(2026, 2, 14) }}
        />
      );
      expect(screen.getByLabelText("Clear date range")).toBeInTheDocument();
    });

    it("does not show clear button when no value", () => {
      render(<DateRangePicker />);
      expect(
        screen.queryByLabelText("Clear date range")
      ).not.toBeInTheDocument();
    });

    it("clears value when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ from: new Date(2026, 2, 1), to: new Date(2026, 2, 14) }}
          onChange={onChange}
        />
      );
      await user.click(screen.getByLabelText("Clear date range"));
      expect(onChange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
      });
    });

    it("does not show clear button when disabled", () => {
      render(
        <DateRangePicker
          value={{ from: new Date(2026, 2, 1), to: new Date(2026, 2, 14) }}
          disabled
        />
      );
      expect(
        screen.queryByLabelText("Clear date range")
      ).not.toBeInTheDocument();
    });
  });

  describe("presets", () => {
    it("renders preset buttons when presets are provided", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const presets = [
        {
          label: "Last 7 days",
          range: { from: addDays(today, -6), to: today },
        },
        {
          label: "Last 30 days",
          range: { from: addDays(today, -29), to: today },
        },
      ];
      render(<DateRangePicker presets={presets} />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      expect(screen.getByText("Last 7 days")).toBeInTheDocument();
      expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });

    it("selects a preset range on click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const today = new Date();
      const rangeVal = { from: addDays(today, -6), to: today };
      const presets = [{ label: "Last 7 days", range: rangeVal }];
      render(<DateRangePicker presets={presets} onChange={onChange} />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      await user.click(screen.getByText("Last 7 days"));
      expect(onChange).toHaveBeenCalledWith(rangeVal);
    });

    it("closes calendar after selecting a preset", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const presets = [
        {
          label: "Last 7 days",
          range: { from: addDays(today, -6), to: today },
        },
      ];
      render(<DateRangePicker presets={presets} />);
      const trigger = screen.getByTestId("daterangepicker-trigger");
      await user.click(trigger);
      await user.click(screen.getByText("Last 7 days"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("single calendar mode", () => {
    it("renders with numberOfMonths=1", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker numberOfMonths={1} />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      expect(
        screen.getByTestId("daterangepicker-popover")
      ).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables the trigger button", () => {
      render(<DateRangePicker disabled />);
      expect(
        screen.getByTestId("daterangepicker-trigger")
      ).toBeDisabled();
    });

    it("does not open calendar when disabled", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker disabled />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      expect(
        screen.queryByTestId("daterangepicker-popover")
      ).not.toBeInTheDocument();
    });

    it("applies disabled styling (opacity)", () => {
      render(<DateRangePicker disabled />);
      expect(screen.getByTestId("daterangepicker-trigger")).toHaveClass(
        "opacity-50"
      );
    });
  });

  describe("error state", () => {
    it("renders error message", () => {
      render(
        <DateRangePicker error errorMessage="Range is required" />
      );
      expect(screen.getByText("Range is required")).toBeInTheDocument();
    });

    it("applies error styling to trigger", () => {
      render(<DateRangePicker error />);
      expect(screen.getByTestId("daterangepicker-trigger")).toHaveClass(
        "border-red/50"
      );
    });

    it("hides helper text when error is shown", () => {
      render(
        <DateRangePicker
          helperText="Choose a range"
          error
          errorMessage="Required"
        />
      );
      expect(
        screen.queryByText("Choose a range")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as uncontrolled with defaultValue", () => {
      const from = new Date(2026, 2, 1);
      const to = new Date(2026, 2, 14);
      render(<DateRangePicker defaultValue={{ from, to }} />);
      expect(
        screen.getByText(
          `${format(from, "MMM d, yyyy")} \u2013 ${format(to, "MMM d, yyyy")}`
        )
      ).toBeInTheDocument();
    });

    it("works as controlled component", () => {
      const from = new Date(2026, 2, 1);
      const to = new Date(2026, 2, 14);
      const { rerender } = render(
        <DateRangePicker value={{ from, to }} />
      );
      expect(
        screen.getByText(
          `${format(from, "MMM d, yyyy")} \u2013 ${format(to, "MMM d, yyyy")}`
        )
      ).toBeInTheDocument();

      const newFrom = new Date(2026, 5, 1);
      const newTo = new Date(2026, 5, 15);
      rerender(<DateRangePicker value={{ from: newFrom, to: newTo }} />);
      expect(
        screen.getByText(
          `${format(newFrom, "MMM d, yyyy")} \u2013 ${format(newTo, "MMM d, yyyy")}`
        )
      ).toBeInTheDocument();
    });
  });

  describe("form integration", () => {
    it("renders hidden input with name and value", () => {
      const from = new Date(2026, 2, 1);
      const to = new Date(2026, 2, 14);
      const { container } = render(
        <DateRangePicker name="daterange" value={{ from, to }} />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.name).toBe("daterange");
      expect(hidden.value).toBe(
        `${from.toISOString()}/${to.toISOString()}`
      );
    });

    it("does not render hidden input when name is not provided", () => {
      const { container } = render(
        <DateRangePicker
          value={{
            from: new Date(2026, 2, 1),
            to: new Date(2026, 2, 14),
          }}
        />
      );
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).not.toBeInTheDocument();
    });

    it("renders empty hidden input when no value", () => {
      const { container } = render(
        <DateRangePicker name="daterange" />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.value).toBe("");
    });
  });

  describe("accessibility", () => {
    it("has aria-haspopup dialog on trigger", () => {
      render(<DateRangePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-haspopup",
        "dialog"
      );
    });

    it("has aria-expanded false when closed", () => {
      render(<DateRangePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("has aria-expanded true when open", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("clear button has aria-label", () => {
      render(
        <DateRangePicker
          value={{
            from: new Date(2026, 2, 1),
            to: new Date(2026, 2, 14),
          }}
        />
      );
      expect(
        screen.getByLabelText("Clear date range")
      ).toBeInTheDocument();
    });
  });

  describe("alignment", () => {
    it("defaults to start alignment", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      const popover = screen.getByTestId("daterangepicker-popover");
      expect(popover).toHaveClass("left-0");
    });

    it("applies end alignment", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker align="end" />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      const popover = screen.getByTestId("daterangepicker-popover");
      expect(popover).toHaveClass("right-0");
    });

    it("applies center alignment", async () => {
      const user = userEvent.setup();
      render(<DateRangePicker align="center" />);
      await user.click(screen.getByTestId("daterangepicker-trigger"));
      const popover = screen.getByTestId("daterangepicker-popover");
      expect(popover).toHaveClass("left-1/2");
    });
  });

  describe("DateRangePicker inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <DateRangePicker label="Own Label" error errorMessage="Own error" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("suppresses own helper text when inside Field", () => {
      render(
        <Field label="Field Label">
          <DateRangePicker helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<DateRangePicker label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <DateRangePicker label="Booking dates" placeholder="Select range" />
    );
    await expectNoA11yViolations(container);
  });
});

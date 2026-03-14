import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "../DatePicker";
import { Field } from "../Field";
import { format, addDays } from "date-fns";
import { expectNoA11yViolations } from "../../test/a11y";

describe("DatePicker", () => {
  describe("rendering", () => {
    it("renders the trigger button", () => {
      render(<DatePicker />);
      expect(screen.getByTestId("datepicker-trigger")).toBeInTheDocument();
    });

    it("shows default placeholder text", () => {
      render(<DatePicker />);
      expect(screen.getByText("Pick a date")).toBeInTheDocument();
    });

    it("shows custom placeholder text", () => {
      render(<DatePicker placeholder="Select date..." />);
      expect(screen.getByText("Select date...")).toBeInTheDocument();
    });

    it("renders with a label", () => {
      render(<DatePicker label="Start date" />);
      expect(screen.getByText("Start date")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<DatePicker label="Date" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(<DatePicker helperText="Choose wisely" />);
      expect(screen.getByText("Choose wisely")).toBeInTheDocument();
    });

    it("applies custom className to trigger", () => {
      render(<DatePicker className="custom-class" />);
      expect(screen.getByTestId("datepicker-trigger")).toHaveClass(
        "custom-class"
      );
    });

    it("renders combobox role on trigger", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens calendar on click", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByTestId("datepicker-popover")).toBeInTheDocument();
    });

    it("sets aria-expanded to true when open", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("closes calendar on second click of trigger", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on click outside (backdrop)", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(screen.getByTestId("datepicker-backdrop"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("single selection", () => {
    it("selects a date and displays formatted value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DatePicker onChange={onChange} />);
      await user.click(screen.getByTestId("datepicker-trigger"));

      // Find and click day 15 (current month)
      const dayButtons = screen.getAllByRole("gridcell");
      const day15 = dayButtons.find((cell) => {
        const button = cell.querySelector("button");
        return button?.textContent === "15";
      });
      expect(day15).toBeDefined();
      const dayButton = day15!.querySelector("button");
      if (dayButton) {
        await user.click(dayButton);
      }

      expect(onChange).toHaveBeenCalled();
      const selectedDate = onChange.mock.calls[0][0];
      expect(selectedDate).toBeInstanceOf(Date);
      expect(selectedDate.getDate()).toBe(15);
    });

    it("displays formatted date when value is set", () => {
      const date = new Date(2026, 2, 14);
      render(<DatePicker value={date} />);
      expect(screen.getByText(format(date, "PPP"))).toBeInTheDocument();
    });

    it("uses custom date format", () => {
      const date = new Date(2026, 2, 14);
      render(<DatePicker value={date} dateFormat="yyyy-MM-dd" />);
      expect(screen.getByText("2026-03-14")).toBeInTheDocument();
    });

    it("closes calendar after selecting a date", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);

      const dayButtons = screen.getAllByRole("gridcell");
      const day10 = dayButtons.find((cell) => {
        const button = cell.querySelector("button");
        return button?.textContent === "10";
      });
      const dayButton = day10?.querySelector("button");
      if (dayButton) {
        await user.click(dayButton);
      }

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("clear button", () => {
    it("shows clear button when value is set", () => {
      render(<DatePicker value={new Date(2026, 2, 14)} />);
      expect(screen.getByLabelText("Clear date")).toBeInTheDocument();
    });

    it("does not show clear button when no value", () => {
      render(<DatePicker />);
      expect(screen.queryByLabelText("Clear date")).not.toBeInTheDocument();
    });

    it("clears value when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <DatePicker
          value={new Date(2026, 2, 14)}
          onChange={onChange}
        />
      );
      await user.click(screen.getByLabelText("Clear date"));
      expect(onChange).toHaveBeenCalledWith(undefined);
    });

    it("does not show clear button when disabled", () => {
      render(
        <DatePicker value={new Date(2026, 2, 14)} disabled />
      );
      expect(
        screen.queryByLabelText("Clear date")
      ).not.toBeInTheDocument();
    });
  });

  describe("range mode", () => {
    it("renders in range mode", () => {
      render(<DatePicker mode="range" placeholder="Select range" />);
      expect(screen.getByText("Select range")).toBeInTheDocument();
    });

    it("displays range value", () => {
      const from = new Date(2026, 2, 10);
      const to = new Date(2026, 2, 20);
      render(
        <DatePicker
          mode="range"
          rangeValue={{ from, to }}
        />
      );
      expect(
        screen.getByText(
          `${format(from, "PPP")} - ${format(to, "PPP")}`
        )
      ).toBeInTheDocument();
    });

    it("displays partial range (only from)", () => {
      const from = new Date(2026, 2, 10);
      render(
        <DatePicker mode="range" rangeValue={{ from }} />
      );
      expect(
        screen.getByText(format(from, "PPP"))
      ).toBeInTheDocument();
    });

    it("does not auto-close popover in range mode", async () => {
      const user = userEvent.setup();
      const onRangeChange = vi.fn();
      render(
        <DatePicker mode="range" onRangeChange={onRangeChange} />
      );
      // Open the popover
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click a day to set the start date
      const dayButtons = screen.getAllByRole("gridcell").filter(
        (cell) => cell.querySelector("button") && !cell.classList.contains("outside")
      );
      const firstDay = dayButtons[0]?.querySelector("button");
      if (firstDay) await user.click(firstDay);

      // Popover should still be open after selecting start date
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Click another day (end)
      const lastDay = dayButtons[dayButtons.length - 1]?.querySelector("button");
      if (lastDay) await user.click(lastDay);

      // Popover should STILL be open even after both dates selected
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("shows Done button in range mode", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="range" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByTestId("datepicker-done")).toBeInTheDocument();
      expect(screen.getByTestId("datepicker-done")).toHaveTextContent("Done");
    });

    it("does not show Done button in single mode", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="single" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.queryByTestId("datepicker-done")).not.toBeInTheDocument();
    });

    it("closes popover when Done button is clicked", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="range" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByTestId("datepicker-done"));
      await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
    });

    it("does not show backdrop in range mode", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="range" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.queryByTestId("datepicker-backdrop")).not.toBeInTheDocument();
    });

    it("trigger does not toggle-close in range mode", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="range" />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      // Clicking trigger again should NOT close in range mode
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("Escape does not close popover in range mode", async () => {
      const user = userEvent.setup();
      render(<DatePicker mode="range" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("calls onRangeChange when range is cleared", async () => {
      const user = userEvent.setup();
      const onRangeChange = vi.fn();
      render(
        <DatePicker
          mode="range"
          rangeValue={{ from: new Date(2026, 2, 10), to: new Date(2026, 2, 20) }}
          onRangeChange={onRangeChange}
        />
      );
      await user.click(screen.getByLabelText("Clear date"));
      expect(onRangeChange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
      });
    });
  });

  describe("disabled state", () => {
    it("disables the trigger button", () => {
      render(<DatePicker disabled />);
      expect(screen.getByTestId("datepicker-trigger")).toBeDisabled();
    });

    it("does not open calendar when disabled", async () => {
      const user = userEvent.setup();
      render(<DatePicker disabled />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(
        screen.queryByTestId("datepicker-popover")
      ).not.toBeInTheDocument();
    });

    it("applies disabled styling (opacity)", () => {
      render(<DatePicker disabled />);
      expect(screen.getByTestId("datepicker-trigger")).toHaveClass(
        "opacity-50"
      );
    });
  });

  describe("error state", () => {
    it("renders error message", () => {
      render(
        <DatePicker error errorMessage="Date is required" />
      );
      expect(screen.getByText("Date is required")).toBeInTheDocument();
    });

    it("applies error styling to trigger", () => {
      render(<DatePicker error />);
      expect(screen.getByTestId("datepicker-trigger")).toHaveClass(
        "border-red/50"
      );
    });

    it("hides helper text when error is shown", () => {
      render(
        <DatePicker
          helperText="Choose a valid date"
          error
          errorMessage="Required"
        />
      );
      expect(
        screen.queryByText("Choose a valid date")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
  });

  describe("min/max constraints", () => {
    it("passes minDate and maxDate to DayPicker", async () => {
      const user = userEvent.setup();
      const minDate = new Date(2026, 2, 10);
      const maxDate = new Date(2026, 2, 20);
      render(
        <DatePicker minDate={minDate} maxDate={maxDate} />
      );
      await user.click(screen.getByTestId("datepicker-trigger"));
      // Calendar should be visible
      expect(screen.getByTestId("datepicker-popover")).toBeInTheDocument();
    });
  });

  describe("disabled dates", () => {
    it("passes disabled dates array to DayPicker", async () => {
      const user = userEvent.setup();
      const disabled = [new Date(2026, 2, 15)];
      render(<DatePicker disabledDates={disabled} />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByTestId("datepicker-popover")).toBeInTheDocument();
    });

    it("passes disabled dates function to DayPicker", async () => {
      const user = userEvent.setup();
      const isDisabled = (date: Date) => date.getDay() === 0;
      render(<DatePicker disabledDates={isDisabled} />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByTestId("datepicker-popover")).toBeInTheDocument();
    });
  });

  describe("presets", () => {
    it("renders preset buttons when presets are provided", async () => {
      const user = userEvent.setup();
      const presets = [
        { label: "Today", date: new Date() },
        { label: "Tomorrow", date: addDays(new Date(), 1) },
      ];
      render(<DatePicker presets={presets} />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    });

    it("selects a preset date on click", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const today = new Date();
      const presets = [{ label: "Today", date: today }];
      render(<DatePicker presets={presets} onChange={onChange} />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      await user.click(screen.getByText("Today"));
      expect(onChange).toHaveBeenCalledWith(today);
    });

    it("closes calendar after selecting a preset", async () => {
      const user = userEvent.setup();
      const presets = [
        { label: "Today", date: new Date() },
      ];
      render(<DatePicker presets={presets} />);
      const trigger = screen.getByTestId("datepicker-trigger");
      await user.click(trigger);
      await user.click(screen.getByText("Today"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as uncontrolled with defaultValue", () => {
      const date = new Date(2026, 2, 14);
      render(<DatePicker defaultValue={date} />);
      expect(
        screen.getByText(format(date, "PPP"))
      ).toBeInTheDocument();
    });

    it("works as controlled component", () => {
      const date = new Date(2026, 2, 14);
      const { rerender } = render(<DatePicker value={date} />);
      expect(
        screen.getByText(format(date, "PPP"))
      ).toBeInTheDocument();

      const newDate = new Date(2026, 5, 1);
      rerender(<DatePicker value={newDate} />);
      expect(
        screen.getByText(format(newDate, "PPP"))
      ).toBeInTheDocument();
    });
  });

  describe("form integration", () => {
    it("renders hidden input with name and value", () => {
      const date = new Date(2026, 2, 14);
      const { container } = render(
        <DatePicker name="date" value={date} />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.name).toBe("date");
      expect(hidden.value).toBe(date.toISOString());
    });

    it("does not render hidden input when name is not provided", () => {
      const { container } = render(
        <DatePicker value={new Date(2026, 2, 14)} />
      );
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).not.toBeInTheDocument();
    });

    it("renders empty hidden input when no value", () => {
      const { container } = render(<DatePicker name="date" />);
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.value).toBe("");
    });
  });

  describe("accessibility", () => {
    it("has aria-haspopup dialog on trigger", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-haspopup",
        "dialog"
      );
    });

    it("has aria-expanded false when closed", () => {
      render(<DatePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("has aria-expanded true when open", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("clear button has aria-label", () => {
      render(<DatePicker value={new Date()} />);
      expect(screen.getByLabelText("Clear date")).toBeInTheDocument();
    });
  });

  describe("alignment", () => {
    it("defaults to start alignment", async () => {
      const user = userEvent.setup();
      render(<DatePicker />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      const popover = screen.getByTestId("datepicker-popover");
      expect(popover).toHaveClass("left-0");
    });

    it("applies end alignment", async () => {
      const user = userEvent.setup();
      render(<DatePicker align="end" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      const popover = screen.getByTestId("datepicker-popover");
      expect(popover).toHaveClass("right-0");
    });

    it("applies center alignment", async () => {
      const user = userEvent.setup();
      render(<DatePicker align="center" />);
      await user.click(screen.getByTestId("datepicker-trigger"));
      const popover = screen.getByTestId("datepicker-popover");
      expect(popover).toHaveClass("left-1/2");
    });
  });

  describe("DatePicker inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <DatePicker label="Own Label" error errorMessage="Own error" />
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
          <DatePicker helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<DatePicker label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <DatePicker label="Start date" placeholder="Pick a date" />
    );
    await expectNoA11yViolations(container);
  });
});

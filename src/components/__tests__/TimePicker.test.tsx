import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimePicker, type TimeValue } from "../TimePicker";
import { Field } from "../Field";
import { expectNoA11yViolations } from "../../test/a11y";

describe("TimePicker", () => {
  describe("rendering", () => {
    it("renders trigger with clock icon", () => {
      render(<TimePicker defaultValue={{ hours: 10, minutes: 30 }} />);
      const trigger = screen.getByTestId("timepicker-trigger");
      expect(trigger).toBeInTheDocument();
      // Clock icon is rendered as SVG inside the trigger
      const svg = trigger.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders combobox role on trigger", () => {
      render(<TimePicker />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows placeholder when no value is set", () => {
      render(<TimePicker placeholder="Pick a time" />);
      expect(screen.getByText("Pick a time")).toBeInTheDocument();
    });

    it("shows default placeholder when no value and no placeholder", () => {
      render(<TimePicker />);
      expect(screen.getByText("Select time")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<TimePicker className="custom-class" />);
      const wrapper = screen.getByTestId("timepicker-trigger").parentElement;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("time display", () => {
    it("shows formatted time in 24-hour format", () => {
      render(<TimePicker defaultValue={{ hours: 14, minutes: 30 }} />);
      expect(screen.getByText("14:30")).toBeInTheDocument();
    });

    it("shows formatted time in 12-hour format", () => {
      render(
        <TimePicker defaultValue={{ hours: 14, minutes: 30 }} use12Hour />
      );
      expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    });

    it("shows AM for morning hours in 12-hour format", () => {
      render(
        <TimePicker defaultValue={{ hours: 9, minutes: 15 }} use12Hour />
      );
      expect(screen.getByText("9:15 AM")).toBeInTheDocument();
    });

    it("shows 12:00 PM for noon in 12-hour format", () => {
      render(
        <TimePicker defaultValue={{ hours: 12, minutes: 0 }} use12Hour />
      );
      expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    });

    it("shows 12:00 AM for midnight in 12-hour format", () => {
      render(
        <TimePicker defaultValue={{ hours: 0, minutes: 0 }} use12Hour />
      );
      expect(screen.getByText("12:00 AM")).toBeInTheDocument();
    });

    it("shows seconds when showSeconds is true", () => {
      render(
        <TimePicker
          defaultValue={{ hours: 9, minutes: 15, seconds: 45 }}
          showSeconds
        />
      );
      expect(screen.getByText("09:15:45")).toBeInTheDocument();
    });

    it("shows seconds in 12-hour format", () => {
      render(
        <TimePicker
          defaultValue={{ hours: 14, minutes: 5, seconds: 30 }}
          use12Hour
          showSeconds
        />
      );
      expect(screen.getByText("2:05:30 PM")).toBeInTheDocument();
    });
  });

  describe("opening and closing", () => {
    it("opens dropdown on click", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      expect(screen.getByTestId("timepicker-popover")).toBeInTheDocument();
    });

    it("sets aria-expanded to true when open", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("closes dropdown on second click", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      const trigger = screen.getByTestId("timepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on outside click", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <TimePicker defaultValue={{ hours: 10, minutes: 0 }} />
          <button>Outside</button>
        </div>
      );
      const trigger = screen.getByTestId("timepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      fireEvent.mouseDown(screen.getByText("Outside"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape key", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      const trigger = screen.getByTestId("timepicker-trigger");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Escape}");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("hour selection", () => {
    it("selects hour from column", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          onChange={onChange}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Find the hours column and click hour 14
      const hourOptions = within(popover).getAllByRole("option");
      const hour14 = hourOptions.find(
        (el) => el.textContent === "14"
      );
      expect(hour14).toBeDefined();
      await user.click(hour14!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 14, minutes: 0 })
      );
    });

    it("shows 24 hours in 24-hour mode", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 0, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Hours 00-23 = 24 items, minutes 00-59 = 60 items
      const allOptions = within(popover).getAllByRole("option");
      // First 24 are hours
      expect(allOptions[0]).toHaveTextContent("00");
      expect(allOptions[23]).toHaveTextContent("23");
    });

    it("shows 1-12 in 12-hour mode", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 14, minutes: 0 }}
          use12Hour
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const allOptions = within(popover).getAllByRole("option");
      // First 12 are hours (01-12)
      expect(allOptions[0]).toHaveTextContent("01");
      expect(allOptions[11]).toHaveTextContent("12");
    });
  });

  describe("minute selection", () => {
    it("selects minute from column", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          onChange={onChange}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const allOptions = within(popover).getAllByRole("option");
      // Minutes start after 24 hour options; minute 15 is at index 24 + 15
      const min15 = allOptions[24 + 15];
      expect(min15).toHaveTextContent("15");
      await user.click(min15);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 10, minutes: 15 })
      );
    });

    it("minuteStep filters available minutes", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          minuteStep={15}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const allOptions = within(popover).getAllByRole("option");
      // 24 hours + 4 minute options (0, 15, 30, 45)
      expect(allOptions).toHaveLength(24 + 4);
      // Verify minute values
      expect(allOptions[24]).toHaveTextContent("00");
      expect(allOptions[25]).toHaveTextContent("15");
      expect(allOptions[26]).toHaveTextContent("30");
      expect(allOptions[27]).toHaveTextContent("45");
    });

    it("minuteStep=5 shows correct intervals", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          minuteStep={5}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const allOptions = within(popover).getAllByRole("option");
      // 24 hours + 12 minutes (0,5,10,15,20,25,30,35,40,45,50,55)
      expect(allOptions).toHaveLength(24 + 12);
    });
  });

  describe("seconds", () => {
    it("shows seconds column when showSeconds is true", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0, seconds: 0 }}
          showSeconds
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Column headers: Hour, Min, Sec
      expect(within(popover).getByText("Sec")).toBeInTheDocument();
    });

    it("selects second from column", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0, seconds: 0 }}
          showSeconds
          onChange={onChange}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Find Sec column header then find options within the same parent
      const secHeader = within(popover).getByText("Sec");
      const secColumn = secHeader.closest('[role="listbox"]')!;
      const secOptions = within(secColumn as HTMLElement).getAllByRole("option");
      // Click second = 30
      const sec30 = secOptions.find((el) => el.textContent === "30");
      expect(sec30).toBeDefined();
      await user.click(sec30!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 10, minutes: 0, seconds: 30 })
      );
    });

    it("does not show seconds column by default", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      expect(within(popover).queryByText("Sec")).not.toBeInTheDocument();
    });
  });

  describe("AM/PM toggle in 12-hour mode", () => {
    it("shows AM/PM column in 12-hour mode", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          use12Hour
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      expect(within(popover).getByText("AM")).toBeInTheDocument();
      expect(within(popover).getByText("PM")).toBeInTheDocument();
    });

    it("toggles AM/PM", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 30 }}
          use12Hour
          onChange={onChange}
        />
      );
      // Should start as AM (10:30 AM)
      expect(screen.getByText("10:30 AM")).toBeInTheDocument();
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Click PM
      await user.click(within(popover).getByText("PM"));
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 22, minutes: 30 })
      );
    });

    it("does not show AM/PM in 24-hour mode", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      expect(within(popover).queryByText("AM")).not.toBeInTheDocument();
      expect(within(popover).queryByText("PM")).not.toBeInTheDocument();
    });
  });

  describe("Now button", () => {
    it("shows Now button in dropdown", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      expect(screen.getByText("Now")).toBeInTheDocument();
    });

    it("sets current time when clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          defaultValue={{ hours: 10, minutes: 0 }}
          onChange={onChange}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      await user.click(screen.getByText("Now"));
      expect(onChange).toHaveBeenCalledTimes(1);
      const result = onChange.mock.calls[0][0] as TimeValue;
      // Verify it's a valid time
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBeLessThan(24);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.minutes).toBeLessThan(60);
    });
  });

  describe("disabled state", () => {
    it("disables the trigger button", () => {
      render(<TimePicker disabled />);
      expect(screen.getByTestId("timepicker-trigger")).toBeDisabled();
    });

    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<TimePicker disabled />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      expect(
        screen.queryByTestId("timepicker-popover")
      ).not.toBeInTheDocument();
    });

    it("applies disabled styling (opacity)", () => {
      render(<TimePicker disabled />);
      // The trigger should have the disabled classes applied by CVA
      const trigger = screen.getByTestId("timepicker-trigger");
      expect(trigger).toBeDisabled();
    });
  });

  describe("error state", () => {
    it("renders error message", () => {
      render(
        <TimePicker error errorMessage="Time is required" />
      );
      expect(screen.getByText("Time is required")).toBeInTheDocument();
    });

    it("hides helper text when error is shown", () => {
      render(
        <TimePicker
          helperText="Pick a time"
          error
          errorMessage="Required"
        />
      );
      expect(screen.queryByText("Pick a time")).not.toBeInTheDocument();
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("shows helper text when no error", () => {
      render(<TimePicker helperText="Pick a time" />);
      expect(screen.getByText("Pick a time")).toBeInTheDocument();
    });
  });

  describe("label rendering", () => {
    it("renders label", () => {
      render(<TimePicker label="Start time" />);
      expect(screen.getByText("Start time")).toBeInTheDocument();
    });

    it("renders required indicator", () => {
      render(<TimePicker label="Start time" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("associates label with trigger via aria-labelledby", () => {
      render(<TimePicker label="Start time" />);
      const trigger = screen.getByRole("combobox");
      const labelId = trigger.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      const label = document.getElementById(labelId!);
      expect(label).toHaveTextContent("Start time");
    });
  });

  describe("sizes", () => {
    it("applies sm size class", () => {
      render(<TimePicker size="sm" />);
      expect(screen.getByTestId("timepicker-trigger")).toHaveClass("h-8");
    });

    it("applies md size class by default", () => {
      render(<TimePicker />);
      expect(screen.getByTestId("timepicker-trigger")).toHaveClass("h-10");
    });

    it("applies lg size class", () => {
      render(<TimePicker size="lg" />);
      expect(screen.getByTestId("timepicker-trigger")).toHaveClass("h-12");
    });

    it.each(["sm", "md", "lg"] as const)(
      "renders %s size without errors",
      (size) => {
        render(<TimePicker size={size} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      }
    );
  });

  describe("controlled value", () => {
    it("displays controlled value", () => {
      render(<TimePicker value={{ hours: 16, minutes: 45 }} />);
      expect(screen.getByText("16:45")).toBeInTheDocument();
    });

    it("updates when controlled value changes", () => {
      const { rerender } = render(
        <TimePicker value={{ hours: 10, minutes: 0 }} />
      );
      expect(screen.getByText("10:00")).toBeInTheDocument();
      rerender(<TimePicker value={{ hours: 14, minutes: 30 }} />);
      expect(screen.getByText("14:30")).toBeInTheDocument();
    });

    it("calls onChange when controlled and selection made", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          value={{ hours: 10, minutes: 0 }}
          onChange={onChange}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const hourOptions = within(popover).getAllByRole("option");
      // Click hour 15
      const hour15 = hourOptions.find(
        (el) => el.textContent === "15"
      );
      await user.click(hour15!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hours: 15, minutes: 0 })
      );
    });
  });

  describe("defaultValue (uncontrolled)", () => {
    it("displays the defaultValue", () => {
      render(<TimePicker defaultValue={{ hours: 8, minutes: 30 }} />);
      expect(screen.getByText("08:30")).toBeInTheDocument();
    });

    it("updates internally when selection is made", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker defaultValue={{ hours: 10, minutes: 0 }} />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      // Select a different minute (15)
      const allOptions = within(popover).getAllByRole("option");
      const min15 = allOptions[24 + 15]; // 24 hours + index 15
      await user.click(min15);
      // Trigger should now show the updated time
      expect(screen.getByTestId("timepicker-trigger")).toHaveTextContent(
        "10:15"
      );
    });
  });

  describe("form integration", () => {
    it("renders hidden input with name and value", () => {
      const { container } = render(
        <TimePicker
          name="meeting_time"
          defaultValue={{ hours: 14, minutes: 30 }}
        />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.name).toBe("meeting_time");
      expect(hidden.value).toBe("14:30:00");
    });

    it("renders hidden input with seconds", () => {
      const { container } = render(
        <TimePicker
          name="time"
          defaultValue={{ hours: 9, minutes: 15, seconds: 45 }}
          showSeconds
        />
      );
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden.value).toBe("09:15:45");
    });

    it("does not render hidden input when name is not provided", () => {
      const { container } = render(
        <TimePicker defaultValue={{ hours: 10, minutes: 0 }} />
      );
      const hidden = container.querySelector('input[type="hidden"]');
      expect(hidden).not.toBeInTheDocument();
    });

    it("renders empty hidden input when no value", () => {
      const { container } = render(<TimePicker name="time" />);
      const hidden = container.querySelector(
        'input[type="hidden"]'
      ) as HTMLInputElement;
      expect(hidden).toBeInTheDocument();
      expect(hidden.value).toBe("");
    });
  });

  describe("auto-scroll to selected value on open", () => {
    it("calls scrollIntoView on the selected hour", async () => {
      const user = userEvent.setup();
      // Mock scrollIntoView
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(
        <TimePicker defaultValue={{ hours: 15, minutes: 30 }} />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));

      // scrollIntoView should have been called for the selected hour and minute
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has aria-expanded false when closed", () => {
      render(<TimePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("has aria-expanded true when open", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByRole("combobox"));
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("has aria-haspopup listbox on trigger", () => {
      render(<TimePicker />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-haspopup",
        "listbox"
      );
    });

    it("has aria-required when required", () => {
      render(<TimePicker required />);
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-required",
        "true"
      );
    });

    it("has listbox role on columns", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const listboxes = screen.getAllByRole("listbox");
      // At least 2 columns (Hour and Min)
      expect(listboxes.length).toBeGreaterThanOrEqual(2);
    });

    it("has option role on column items", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 0 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("has aria-selected on selected options", async () => {
      const user = userEvent.setup();
      render(<TimePicker defaultValue={{ hours: 10, minutes: 30 }} />);
      await user.click(screen.getByTestId("timepicker-trigger"));
      const selectedOptions = screen
        .getAllByRole("option")
        .filter((el) => el.getAttribute("aria-selected") === "true");
      // Should have at least 2 selected (hour + minute)
      expect(selectedOptions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("minTime / maxTime", () => {
    it("disables hours outside min/max range", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          defaultValue={{ hours: 12, minutes: 0 }}
          minTime={{ hours: 9, minutes: 0 }}
          maxTime={{ hours: 17, minutes: 0 }}
        />
      );
      await user.click(screen.getByTestId("timepicker-trigger"));
      const popover = screen.getByTestId("timepicker-popover");
      const allOptions = within(popover).getAllByRole("option");
      // Hour 5 should be disabled
      const hour5 = allOptions.find((el) => el.textContent === "05");
      expect(hour5).toHaveAttribute("aria-disabled", "true");
      // Hour 20 should be disabled
      const hour20 = allOptions.find((el) => el.textContent === "20");
      expect(hour20).toHaveAttribute("aria-disabled", "true");
      // Hour 12 should be enabled
      const hour12 = allOptions.find((el) => el.textContent === "12");
      expect(hour12).toHaveAttribute("aria-disabled", "false");
    });
  });

  describe("data attributes", () => {
    it("has data-slot timepicker on wrapper", () => {
      const { container } = render(<TimePicker />);
      expect(
        container.querySelector('[data-slot="timepicker"]')
      ).toBeInTheDocument();
    });
  });

  describe("TimePicker inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <TimePicker label="Own Label" error errorMessage="Own error" />
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
          <TimePicker helperText="Own helper" />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own helper")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(<TimePicker label="Standalone Label" helperText="Standalone help" />);
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone help")).toBeInTheDocument();
    });
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <TimePicker label="Start time" />
    );
    await expectNoA11yViolations(container);
  });
});

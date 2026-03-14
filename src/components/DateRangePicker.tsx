"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useFieldAware } from "../hooks/useFieldAware";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useFocusReturn } from "../hooks/useFocusReturn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RangePreset = {
  label: string;
  range: { from: Date; to: Date };
};

export type DateRangePickerProps = {
  value?: { from?: Date; to?: Date };
  defaultValue?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date }) => void;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);

  // Format
  dateFormat?: string;
  placeholder?: string;

  // Form integration
  label?: string;
  /** Description text shown below the picker */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  /** HTML id for the trigger element */
  id?: string;

  // Presets
  presets?: RangePreset[];

  // UI
  className?: string;
  align?: "start" | "center" | "end";
  /** Show two side-by-side calendars. Default true (2). */
  numberOfMonths?: 1 | 2;
};

// ---------------------------------------------------------------------------
// Alignment classes
// ---------------------------------------------------------------------------

const alignmentClasses: Record<
  NonNullable<DateRangePickerProps["align"]>,
  string
> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

// ---------------------------------------------------------------------------
// DayPicker classNames for Charlie UI dark theme (react-day-picker v9)
// ---------------------------------------------------------------------------

const calendarClassNames = {
  root: "relative",
  months: "relative flex gap-4",
  month: "",
  month_caption: "flex items-center justify-center h-7 mb-2",
  caption_label: "text-sm font-medium text-white",
  nav: "absolute top-0 inset-x-0 flex items-center justify-between z-10",
  button_previous:
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors",
  button_next:
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors",
  chevron: "h-4 w-4",
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday: "text-xs text-white/60 font-normal w-9 pb-2 text-center",
  weeks: "",
  week: "",
  day: "p-0 text-center",
  day_button:
    "inline-flex items-center justify-center h-9 w-9 rounded-md text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer",
  today: "border border-white/10 rounded-md",
  outside: "text-white/60",
  disabled: "text-white/10 cursor-not-allowed hover:bg-transparent",
  hidden: "invisible",
  focused: "ring-1 ring-white/20",
  selected: "!bg-accent !text-white hover:!bg-accent rounded-md",
  range_start: "!bg-accent !text-white rounded-md",
  range_end: "!bg-accent !text-white rounded-md",
  range_middle: "!bg-accent/10 rounded-none",
};

// ---------------------------------------------------------------------------
// PresetsSidebar
// ---------------------------------------------------------------------------

function PresetsSidebar({
  presets,
  onSelect,
}: {
  presets: RangePreset[];
  onSelect: (range: { from: Date; to: Date }) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-r border-white/10 pr-3 mr-3 min-w-[140px]">
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          className="text-sm text-white/60 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-md cursor-pointer text-left transition-colors"
          onClick={() => onSelect(preset.range)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom navigation icons
// ---------------------------------------------------------------------------

function CustomChevron({ orientation }: { orientation?: string }) {
  if (orientation === "left") {
    return <ChevronLeft className="h-4 w-4" />;
  }
  return <ChevronRight className="h-4 w-4" />;
}

// ---------------------------------------------------------------------------
// DateRangePicker Component
// ---------------------------------------------------------------------------

function DateRangePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  dateFormat = "MMM d, yyyy",
  placeholder = "Select date range",
  label,
  description,
  helperText,
  error: errorProp,
  errorMessage,
  required: requiredProp,
  disabled: disabledProp,
  name,
  presets,
  className,
  align = "start",
  numberOfMonths = 2,
  id,
}: DateRangePickerProps) {
  const [range, setRange] = useControllableState<{ from?: Date; to?: Date }>(
    value,
    defaultValue ?? { from: undefined, to: undefined },
    onChange
  );

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Focus trap and return for calendar popover
  useFocusTrap(popoverRef, open, true);
  useFocusReturn(open);

  /* ── Field-aware integration ── */
  const resolvedDescription = description ?? helperText;

  const {
    controlId,
    insideField,
    error,
    disabled,
    required,
    ariaDescribedBy,
    ariaInvalid,
  } = useFieldAware({
    id,
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    description: resolvedDescription,
    errorMessage,
  });

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Compute display value
  let displayValue = "";
  if (range?.from && range?.to) {
    displayValue = `${format(range.from, dateFormat)} \u2013 ${format(range.to, dateFormat)}`;
  } else if (range?.from) {
    displayValue = `${format(range.from, dateFormat)} \u2013 ...`;
  }

  // Handlers
  const handleRangeSelect = useCallback(
    (
      selected: DateRange | undefined,
      _triggerDate: Date,
      _modifiers: Record<string, boolean>,
      _e: ReactMouseEvent | React.KeyboardEvent
    ) => {
      const newRange = selected ?? { from: undefined, to: undefined };
      setRange(newRange);
      // Close if both dates are selected
      if (newRange.from && newRange.to) {
        setOpen(false);
      }
    },
    [setRange]
  );

  const handleClear = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      setRange({ from: undefined, to: undefined });
    },
    [setRange]
  );

  const handlePresetSelect = useCallback(
    (preset: { from: Date; to: Date }) => {
      setRange(preset);
      setOpen(false);
    },
    [setRange]
  );

  // Disabled matcher for DayPicker
  const disabledMatcher = (() => {
    const matchers: (Date[] | ((date: Date) => boolean))[] = [];
    if (disabledDates) {
      if (Array.isArray(disabledDates)) {
        matchers.push(disabledDates);
      } else {
        matchers.push(disabledDates);
      }
    }
    if (matchers.length === 0) return undefined;
    if (matchers.length === 1) return matchers[0];
    return matchers;
  })();

  const hasValue = !!(range?.from || range?.to);

  const triggerClasses = cn(
    "flex items-center w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white",
    "outline-none transition-all duration-200 cursor-pointer",
    "focus:ring-1 focus:ring-white/15 focus:border-white/15",
    error && "border-red/50 focus:ring-red/30 focus:border-red/50",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  // Trigger button — shared between Field-aware and standalone modes
  const triggerButton = (
    <button
      type="button"
      role="combobox"
      id={controlId}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      aria-label={label || placeholder}
      disabled={disabled}
      onClick={() => !disabled && setOpen(!open)}
      className={triggerClasses}
      data-testid="daterangepicker-trigger"
    >
      <Calendar className="h-4 w-4 text-white/60 mr-2 shrink-0" />
      <span
        className={cn(
          "flex-1 text-left truncate",
          displayValue ? "text-white" : "text-white/60"
        )}
      >
        {displayValue || placeholder}
      </span>
      {hasValue && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Clear date range"
          className="text-white/60 hover:text-white/60 ml-2 shrink-0 cursor-pointer"
          onClick={handleClear}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClear(e as unknown as ReactMouseEvent);
            }
          }}
        >
          <X className="h-4 w-4" />
        </span>
      )}
    </button>
  );

  // Hidden input for form integration
  const hiddenInput = name ? (
    <input
      type="hidden"
      name={name}
      value={
        range?.from
          ? `${range.from.toISOString()}${range.to ? `/${range.to.toISOString()}` : ""}`
          : ""
      }
    />
  ) : null;

  // Calendar dropdown — shared between both modes
  const calendarDropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute top-full mt-2 z-50",
            alignmentClasses[align]
          )}
          data-testid="daterangepicker-popover"
        >
          <div className="bg-bg-200 border border-white/10 rounded-lg shadow-xl p-3 flex">
            {presets && presets.length > 0 && (
              <PresetsSidebar
                presets={presets}
                onSelect={handlePresetSelect}
              />
            )}

            <DayPicker
              mode="range"
              numberOfMonths={numberOfMonths}
              selected={range as DateRange | undefined}
              onSelect={handleRangeSelect}
              disabled={disabledMatcher}
              startMonth={minDate}
              endMonth={maxDate}
              hidden={
                minDate || maxDate
                  ? [
                      ...(minDate ? [{ before: minDate }] : []),
                      ...(maxDate ? [{ after: maxDate }] : []),
                    ]
                  : undefined
              }
              classNames={calendarClassNames}
              components={{ Chevron: CustomChevron }}
              showOutsideDays
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // When inside a Field, render only the core interactive elements
  if (insideField) {
    return (
      <div ref={containerRef} className="relative inline-block w-full">
        {triggerButton}
        {hiddenInput}
        {calendarDropdown}
      </div>
    );
  }

  // Standalone rendering — identical to original
  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {label && (
        <label htmlFor={controlId} className="text-sm font-medium text-white/80 mb-1.5 block">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}

      {triggerButton}
      {hiddenInput}
      {calendarDropdown}

      {resolvedDescription && !error && (
        <p id={`${controlId}-description`} className="text-xs text-white/60 mt-1.5">{resolvedDescription}</p>
      )}
      {error && errorMessage && (
        <p id={`${controlId}-error`} className="text-xs text-red mt-1.5">{errorMessage}</p>
      )}
    </div>
  );
}

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
export type { RangePreset };

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

// ---------------------------------------------------------------------------
// Controllable state helper
// ---------------------------------------------------------------------------

function useControllableState<T>(
  controlled: T | undefined,
  defaultVal: T | undefined,
  onChange?: (val: T | undefined) => void
) {
  const [internal, setInternal] = useState(defaultVal);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const setValue = useCallback(
    (next: T | undefined) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, setValue] as const;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SinglePreset = { label: string; date: Date };
type RangePreset = { label: string; range: { from: Date; to: Date } };

export type DatePickerProps = {
  // Value
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;

  // Range mode
  mode?: "single" | "range";
  rangeValue?: { from?: Date; to?: Date };
  onRangeChange?: (range: { from?: Date; to?: Date }) => void;

  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);

  // Format
  dateFormat?: string;
  placeholder?: string;

  // Form integration
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;

  // Presets
  presets?: SinglePreset[] | RangePreset[];

  // UI
  className?: string;
  align?: "start" | "center" | "end";
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSinglePreset(p: SinglePreset | RangePreset): p is SinglePreset {
  return "date" in p;
}

const alignmentClasses: Record<NonNullable<DatePickerProps["align"]>, string> =
  {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

// ---------------------------------------------------------------------------
// DayPicker classNames for Charlie UI dark theme (react-day-picker v9)
// ---------------------------------------------------------------------------

const calendarClassNames = {
  // Root
  root: "relative",
  months: "relative",
  month: "",
  month_caption: "flex items-center justify-center h-7 mb-2",
  caption_label: "text-sm font-medium text-white",
  nav: "absolute top-0 inset-x-0 flex items-center justify-between z-10",
  button_previous:
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors",
  button_next:
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors",
  chevron: "h-4 w-4",

  // Grid
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday:
    "text-xs text-white/30 font-normal w-9 pb-2 text-center",

  // Weeks / Days
  weeks: "",
  week: "",
  day: "p-0 text-center",
  day_button:
    "inline-flex items-center justify-center h-9 w-9 rounded-md text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer",

  // Flags
  today: "border border-white/10 rounded-md",
  outside: "text-white/20",
  disabled: "text-white/10 cursor-not-allowed hover:bg-transparent",
  hidden: "invisible",
  focused: "ring-1 ring-white/20",

  // Selection
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
  onSelectSingle,
  onSelectRange,
}: {
  presets: SinglePreset[] | RangePreset[];
  onSelectSingle?: (date: Date) => void;
  onSelectRange?: (range: { from: Date; to: Date }) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 border-r border-white/10 pr-3 mr-3 min-w-[140px]">
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          className="text-sm text-white/60 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-md cursor-pointer text-left transition-colors"
          onClick={() => {
            if (isSinglePreset(preset)) {
              onSelectSingle?.(preset.date);
            } else {
              onSelectRange?.(preset.range);
            }
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom navigation icons (override the default SVG chevron)
// ---------------------------------------------------------------------------

function CustomChevron({ orientation }: { orientation?: string }) {
  if (orientation === "left") {
    return <ChevronLeft className="h-4 w-4" />;
  }
  return <ChevronRight className="h-4 w-4" />;
}

// ---------------------------------------------------------------------------
// DatePicker Component
// ---------------------------------------------------------------------------

function DatePicker({
  value,
  defaultValue,
  onChange,
  mode = "single",
  rangeValue,
  onRangeChange,
  minDate,
  maxDate,
  disabledDates,
  dateFormat = "PPP",
  placeholder = "Pick a date",
  label,
  helperText,
  error = false,
  errorMessage,
  required = false,
  disabled = false,
  name,
  presets,
  className,
  align = "start",
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useControllableState(
    value,
    defaultValue,
    onChange
  );

  const [internalRange, setInternalRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(rangeValue);

  // Sync controlled range
  useEffect(() => {
    if (rangeValue !== undefined) {
      setInternalRange(rangeValue);
    }
  }, [rangeValue]);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const currentRange = rangeValue !== undefined ? rangeValue : internalRange;

  let displayValue = "";
  if (mode === "single" && internalValue) {
    displayValue = format(internalValue, dateFormat);
  } else if (mode === "range" && currentRange) {
    if (currentRange.from && currentRange.to) {
      displayValue = `${format(currentRange.from, dateFormat)} - ${format(currentRange.to, dateFormat)}`;
    } else if (currentRange.from) {
      displayValue = format(currentRange.from, dateFormat);
    }
  }

  // Handlers
  const handleSingleSelect = useCallback(
    (
      date: Date | undefined,
      _triggerDate: Date,
      _modifiers: Record<string, boolean>,
      _e: ReactMouseEvent | React.KeyboardEvent
    ) => {
      setInternalValue(date);
      if (date) setOpen(false);
    },
    [setInternalValue]
  );

  const handleRangeSelect = useCallback(
    (
      range: DateRange | undefined,
      _triggerDate: Date,
      _modifiers: Record<string, boolean>,
      _e: ReactMouseEvent | React.KeyboardEvent
    ) => {
      const newRange = range ?? { from: undefined, to: undefined };
      setInternalRange(newRange);
      onRangeChange?.(newRange);
      // Close if both dates are selected
      if (newRange.from && newRange.to) {
        setOpen(false);
      }
    },
    [onRangeChange]
  );

  const handleClear = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      if (mode === "single") {
        setInternalValue(undefined);
      } else {
        const cleared = { from: undefined, to: undefined };
        setInternalRange(cleared);
        onRangeChange?.(cleared);
      }
    },
    [mode, setInternalValue, onRangeChange]
  );

  const handlePresetSingle = useCallback(
    (date: Date) => {
      setInternalValue(date);
      setOpen(false);
    },
    [setInternalValue]
  );

  const handlePresetRange = useCallback(
    (range: { from: Date; to: Date }) => {
      setInternalRange(range);
      onRangeChange?.(range);
      setOpen(false);
    },
    [onRangeChange]
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

  const hasValue =
    mode === "single" ? !!internalValue : !!(currentRange?.from || currentRange?.to);

  const triggerClasses = cn(
    "flex items-center w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white",
    "outline-none transition-all duration-200 cursor-pointer",
    "focus:ring-1 focus:ring-white/15 focus:border-white/15",
    error && "border-red/50 focus:ring-red/30 focus:border-red/50",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {label && (
        <label className="text-sm font-medium text-white/80 mb-1.5 block">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={triggerClasses}
        data-testid="datepicker-trigger"
      >
        <Calendar className="h-4 w-4 text-white/40 mr-2 shrink-0" />
        <span
          className={cn(
            "flex-1 text-left truncate",
            displayValue ? "text-white" : "text-white/40"
          )}
        >
          {displayValue || placeholder}
        </span>
        {hasValue && !disabled && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            className="text-white/30 hover:text-white/60 ml-2 shrink-0 cursor-pointer"
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

      {/* Hidden input for form integration */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            mode === "single"
              ? internalValue?.toISOString() ?? ""
              : currentRange?.from
                ? `${currentRange.from.toISOString()}${currentRange.to ? `/${currentRange.to.toISOString()}` : ""}`
                : ""
          }
        />
      )}

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 z-50",
              alignmentClasses[align]
            )}
            data-testid="datepicker-popover"
          >
            <div className="bg-bg-200 border border-white/10 rounded-lg shadow-xl p-3 flex">
              {presets && presets.length > 0 && (
                <PresetsSidebar
                  presets={presets}
                  onSelectSingle={handlePresetSingle}
                  onSelectRange={handlePresetRange}
                />
              )}

              {mode === "single" ? (
                <DayPicker
                  mode="single"
                  selected={internalValue}
                  onSelect={handleSingleSelect}
                  disabled={disabledMatcher}
                  startMonth={minDate}
                  endMonth={maxDate}
                  hidden={
                    minDate || maxDate
                      ? {
                          before: minDate,
                          after: maxDate,
                        }
                      : undefined
                  }
                  classNames={calendarClassNames}
                  components={{ Chevron: CustomChevron }}
                  showOutsideDays
                />
              ) : (
                <DayPicker
                  mode="range"
                  selected={currentRange as DateRange | undefined}
                  onSelect={handleRangeSelect}
                  disabled={disabledMatcher}
                  startMonth={minDate}
                  endMonth={maxDate}
                  hidden={
                    minDate || maxDate
                      ? {
                          before: minDate,
                          after: maxDate,
                        }
                      : undefined
                  }
                  classNames={calendarClassNames}
                  components={{ Chevron: CustomChevron }}
                  showOutsideDays
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && !error && (
        <p className="text-xs text-white/40 mt-1.5">{helperText}</p>
      )}
      {error && errorMessage && (
        <p className="text-xs text-red mt-1.5">{errorMessage}</p>
      )}
    </div>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };

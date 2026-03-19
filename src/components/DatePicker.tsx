"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, type Locale } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useFieldAware } from "../hooks/useFieldAware";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { Popover } from "./Popover";

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
  /** date-fns locale for formatting and calendar day names */
  locale?: Locale;

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
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors",
  button_next:
    "inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors",
  chevron: "h-4 w-4",

  // Grid
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday:
    "text-xs text-white/70 font-normal w-9 pb-2 text-center",

  // Weeks / Days
  weeks: "",
  week: "",
  day: "p-0 text-center",
  day_button:
    "inline-flex items-center justify-center h-9 w-9 rounded-md text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer",

  // Flags
  today: "border border-white/10 rounded-md",
  outside: "text-white/70",
  disabled: "text-white/10 cursor-not-allowed hover:bg-transparent",
  hidden: "invisible !border-transparent",
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
          className="text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-md cursor-pointer text-left transition-colors"
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
// Shared: builds the disabled-dates matcher for DayPicker
// ---------------------------------------------------------------------------

function buildDisabledMatcher(
  disabledDates?: Date[] | ((date: Date) => boolean)
) {
  if (!disabledDates) return undefined;
  return disabledDates;
}

// ---------------------------------------------------------------------------
// Shared: hidden-dates matcher for min/max
// ---------------------------------------------------------------------------

function buildHiddenMatcher(minDate?: Date, maxDate?: Date) {
  if (!minDate && !maxDate) return undefined;
  return [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];
}

// ---------------------------------------------------------------------------
// Trigger button (shared between both modes)
// ---------------------------------------------------------------------------

function TriggerContent({
  displayValue,
  placeholder,
  hasValue,
  disabled,
  onClear,
}: {
  displayValue: string;
  placeholder: string;
  hasValue: boolean;
  disabled: boolean;
  onClear: (e: ReactMouseEvent) => void;
}) {
  return (
    <>
      <Calendar className="h-4 w-4 text-white/70 mr-2 shrink-0" />
      <span
        className={cn(
          "flex-1 text-left truncate",
          displayValue ? "text-white" : "text-white/70"
        )}
      >
        {displayValue || placeholder}
      </span>
      {hasValue && !disabled && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Clear date"
          className="text-white/70 hover:text-white/70 ml-2 shrink-0 cursor-pointer"
          onClick={onClear}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClear(e as unknown as ReactMouseEvent);
            }
          }}
        >
          <X className="h-4 w-4" />
        </span>
      )}
    </>
  );
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
  locale: localeProp,
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
  id,
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: syncing controlled value to internal state
      setInternalRange(rangeValue);
    }
  }, [rangeValue]);

  const [open, setOpen] = useState(false);
  const singlePopoverRef = useRef<HTMLDivElement>(null);

  // Focus trap and return for single mode popover
  useFocusTrap(singlePopoverRef, open && mode === "single", true);
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

  const currentRange = rangeValue !== undefined ? rangeValue : internalRange;

  // Compute display value
  const fmtOpts = localeProp ? { locale: localeProp } : undefined;
  let displayValue = "";
  if (mode === "single" && internalValue) {
    displayValue = format(internalValue, dateFormat, fmtOpts);
  } else if (mode === "range" && currentRange) {
    if (currentRange.from && currentRange.to) {
      displayValue = `${format(currentRange.from, dateFormat, fmtOpts)} - ${format(currentRange.to, dateFormat, fmtOpts)}`;
    } else if (currentRange.from) {
      displayValue = format(currentRange.from, dateFormat, fmtOpts);
    }
  }

  const hasValue =
    mode === "single"
      ? !!internalValue
      : !!(currentRange?.from || currentRange?.to);

  // --- Handlers ---

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
    },
    [onRangeChange]
  );

  // Escape to close (single mode only)
  useEffect(() => {
    if (!open || mode === "range") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, mode]);

  const disabledMatcher = buildDisabledMatcher(disabledDates);
  const hiddenMatcher = buildHiddenMatcher(minDate, maxDate);

  const triggerClasses = cn(
    "flex items-center w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white",
    "outline-none transition-all duration-200 cursor-pointer",
    "focus:ring-1 focus:ring-white/15 focus:border-white/15",
    error && "border-red/50 focus:ring-red/30 focus:border-red/50",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  // Hidden input for form integration
  const hiddenInput = name ? (
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
  ) : null;

  const labelEl = !insideField && label ? (
    <label htmlFor={controlId} className="text-sm font-medium text-white/80 mb-1.5 block">
      {label}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  ) : null;

  const footerEls = !insideField ? (
    <>
      {resolvedDescription && !error && (
        <p id={`${controlId}-description`} className="text-xs text-white/70 mt-1.5">{resolvedDescription}</p>
      )}
      {error && errorMessage && (
        <p id={`${controlId}-error`} className="text-xs text-red mt-1.5">{errorMessage}</p>
      )}
    </>
  ) : null;

  // =========================================================================
  // RANGE MODE — delegates to <Popover dismissible={false}>
  // =========================================================================
  if (mode === "range") {
    return (
      <div className="w-full">
        {labelEl}

        <Popover open={open} className="w-full">
          {/* Trigger — only opens, never closes */}
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
            onClick={() => !disabled && setOpen(true)}
            className={triggerClasses}
            data-testid="datepicker-trigger"
          >
            <TriggerContent
              displayValue={displayValue}
              placeholder={placeholder}
              hasValue={hasValue}
              disabled={disabled}
              onClear={handleClear}
            />
          </button>

          {hiddenInput}

          {/* Calendar — non-dismissible, only Done closes it */}
          <Popover.Content
            dismissible={false}
            align={align === "center" ? "center" : align === "end" ? "end" : "start"}
            className="p-3"
          >
            <div className="flex flex-col">
              <div className="flex">
                {presets && presets.length > 0 && (
                  <PresetsSidebar
                    presets={presets}
                    onSelectRange={handlePresetRange}
                  />
                )}
                <DayPicker
                  mode="range"
                  selected={currentRange as DateRange | undefined}
                  onSelect={handleRangeSelect}
                  disabled={disabledMatcher}
                  startMonth={minDate}
                  endMonth={maxDate}
                  hidden={hiddenMatcher}
                  locale={localeProp}
                  classNames={calendarClassNames}
                  components={{ Chevron: CustomChevron }}
                  showOutsideDays
                />
              </div>

              {/* Done button — the ONLY way to close */}
              <div className="flex justify-end border-t border-white/10 mt-3 pt-3">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent/90 transition-colors cursor-pointer"
                  onClick={() => setOpen(false)}
                  data-testid="datepicker-done"
                >
                  Done
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover>

        {footerEls}
      </div>
    );
  }

  // =========================================================================
  // SINGLE MODE — original implementation with backdrop
  // =========================================================================

  return (
    <div className="relative inline-block w-full">
      {labelEl}

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
        className={cn(triggerClasses, "relative z-20")}
        data-testid="datepicker-trigger"
      >
        <TriggerContent
          displayValue={displayValue}
          placeholder={placeholder}
          hasValue={hasValue}
          disabled={disabled}
          onClear={handleClear}
        />
      </button>

      {hiddenInput}

      {/* Backdrop — click outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpen(false)}
          aria-hidden="true"
          data-testid="datepicker-backdrop"
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={singlePopoverRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 z-50",
              alignmentClasses[align]
            )}
            data-testid="datepicker-popover"
          >
            <div className="bg-bg-200 border border-white/10 rounded-lg shadow-xl p-3">
              <div className="flex">
                {presets && presets.length > 0 && (
                  <PresetsSidebar
                    presets={presets}
                    onSelectSingle={handlePresetSingle}
                  />
                )}
                <DayPicker
                  mode="single"
                  selected={internalValue}
                  onSelect={handleSingleSelect}
                  disabled={disabledMatcher}
                  startMonth={minDate}
                  endMonth={maxDate}
                  hidden={hiddenMatcher}
                  locale={localeProp}
                  classNames={calendarClassNames}
                  components={{ Chevron: CustomChevron }}
                  showOutsideDays
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {footerEls}
    </div>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };

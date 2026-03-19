"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
} from "react";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useFieldAware } from "../hooks/useFieldAware";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useFocusReturn } from "../hooks/useFocusReturn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimeValue = {
  hours: number;
  minutes: number;
  seconds?: number;
};

export type TimePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  /** Controlled value */
  value?: TimeValue;
  /** Default value for uncontrolled usage */
  defaultValue?: TimeValue;
  /** Called when the time value changes */
  onChange?: (time: TimeValue) => void;

  /** Show the seconds column (default false) */
  showSeconds?: boolean;
  /** Use 12-hour format with AM/PM (default false) */
  use12Hour?: boolean;
  /** Minute step interval (default 1) */
  minuteStep?: number;
  /** Second step interval (default 1) */
  secondStep?: number;

  /** Minimum selectable time */
  minTime?: TimeValue;
  /** Maximum selectable time */
  maxTime?: TimeValue;

  /** Label shown above the input */
  label?: string;
  /** Description text shown below the input */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Error message shown below the input */
  errorMessage?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Form field name (renders a hidden input) */
  name?: string;
  /** Placeholder text when no value is set */
  placeholder?: string;

  /** Size variant */
  size?: "sm" | "md" | "lg";
};

// ---------------------------------------------------------------------------
// CVA — trigger sizing
// ---------------------------------------------------------------------------

const triggerVariants = cva(
  [
    "w-full bg-white/5 border rounded-md text-white",
    "flex items-center gap-2 outline-none transition-all duration-200",
    "focus:ring-1 focus:ring-white/15 focus:border-white/15",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      error: {
        true: "border-red/50 focus:ring-red/30 focus:border-red/50",
        false: "border-white/6",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeToMinutes(t: TimeValue): number {
  return t.hours * 3600 + t.minutes * 60 + (t.seconds ?? 0);
}

function isTimeDisabled(
  hours: number,
  minutes: number,
  seconds: number,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean {
  const total = hours * 3600 + minutes * 60 + seconds;
  if (minTime && total < timeToMinutes(minTime)) return true;
  if (maxTime && total > timeToMinutes(maxTime)) return true;
  return false;
}

function isHourDisabled(
  hour: number,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean {
  if (minTime && hour < minTime.hours) return true;
  if (maxTime && hour > maxTime.hours) return true;
  return false;
}

function isMinuteDisabled(
  hour: number,
  minute: number,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean {
  if (minTime) {
    if (hour < minTime.hours) return true;
    if (hour === minTime.hours && minute < minTime.minutes) return true;
  }
  if (maxTime) {
    if (hour > maxTime.hours) return true;
    if (hour === maxTime.hours && minute > maxTime.minutes) return true;
  }
  return false;
}

function isSecondDisabled(
  hour: number,
  minute: number,
  second: number,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean {
  return isTimeDisabled(hour, minute, second, minTime, maxTime);
}

function generateRange(max: number, step: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < max; i += step) {
    result.push(i);
  }
  return result;
}

function formatTimeValue(
  t: TimeValue,
  use12Hour: boolean,
  showSeconds: boolean
): string {
  if (use12Hour) {
    const h = t.hours % 12 || 12;
    const period = t.hours >= 12 ? "PM" : "AM";
    const min = String(t.minutes).padStart(2, "0");
    return showSeconds
      ? `${h}:${min}:${String(t.seconds ?? 0).padStart(2, "0")} ${period}`
      : `${h}:${min} ${period}`;
  }
  const h = String(t.hours).padStart(2, "0");
  const min = String(t.minutes).padStart(2, "0");
  return showSeconds
    ? `${h}:${min}:${String(t.seconds ?? 0).padStart(2, "0")}`
    : `${h}:${min}`;
}

function formatHiddenValue(t: TimeValue): string {
  const h = String(t.hours).padStart(2, "0");
  const m = String(t.minutes).padStart(2, "0");
  const s = String(t.seconds ?? 0).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---------------------------------------------------------------------------
// TimeColumn
// ---------------------------------------------------------------------------

type TimeColumnProps = {
  label: string;
  values: number[];
  selected: number;
  onChange: (value: number) => void;
  isDisabled?: (value: number) => boolean;
};

function TimeColumn({
  label,
  values,
  selected,
  onChange,
  isDisabled,
}: TimeColumnProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRef.current?.scrollIntoView) {
      selectedRef.current.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
  }, []);

  return (
    <div className="flex flex-col w-16" role="listbox" aria-label={label}>
      <div className="text-xs text-white/70 font-medium text-center pb-1 sticky top-0 bg-bg-200 z-10">
        {label}
      </div>
      <div
        ref={scrollContainerRef}
        className={cn(
          "max-h-[200px] overflow-y-auto",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-thumb]:bg-white/10",
          "[&::-webkit-scrollbar-thumb]:rounded-full"
        )}
      >
        {values.map((v) => {
          const disabled = isDisabled?.(v) ?? false;
          return (
            <button
              key={v}
              ref={v === selected ? selectedRef : undefined}
              type="button"
              role="option"
              aria-selected={v === selected}
              aria-disabled={disabled}
              disabled={disabled}
              className={cn(
                "h-8 w-full flex items-center justify-center text-sm rounded-md transition-colors",
                v === selected
                  ? "bg-accent text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
                disabled && "text-white/10 cursor-not-allowed hover:bg-transparent hover:text-white/10"
              )}
              onClick={() => {
                if (!disabled) onChange(v);
              }}
            >
              {String(v).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PeriodColumn
// ---------------------------------------------------------------------------

type PeriodColumnProps = {
  value: "AM" | "PM";
  onChange: (period: "AM" | "PM") => void;
};

function PeriodColumn({ value, onChange }: PeriodColumnProps) {
  return (
    <div className="flex flex-col w-16" role="listbox" aria-label="Period">
      <div className="text-xs text-white/70 font-medium text-center pb-1 sticky top-0 bg-bg-200 z-10">
        &nbsp;
      </div>
      <div className="flex flex-col gap-1 pt-1">
        {(["AM", "PM"] as const).map((period) => (
          <button
            key={period}
            type="button"
            role="option"
            aria-selected={value === period}
            className={cn(
              "h-10 w-full flex items-center justify-center text-xs font-medium rounded-md transition-colors",
              value === period
                ? "bg-accent text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
            onClick={() => onChange(period)}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimePicker
// ---------------------------------------------------------------------------

function TimePicker({
  value,
  defaultValue,
  onChange,
  showSeconds = false,
  use12Hour = false,
  minuteStep = 1,
  secondStep = 1,
  minTime,
  maxTime,
  label,
  description,
  helperText,
  error: errorProp,
  errorMessage,
  required: requiredProp,
  disabled: disabledProp,
  name,
  placeholder,
  size = "md",
  className,
  id,
  ...props
}: TimePickerProps) {
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
    fieldLabelId,
  } = useFieldAware({
    id,
    error: errorProp,
    disabled: disabledProp,
    required: requiredProp,
    description: resolvedDescription,
    errorMessage,
  });

  const labelId = `${controlId}-label`;

  // Controllable state
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<TimeValue | undefined>(
    defaultValue
  );
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue !== undefined;

  const updateValue = useCallback(
    (next: TimeValue) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  // Sync controlled value
  useEffect(() => {
    if (isControlled && value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: syncing controlled value to internal state
      setInternalValue(value);
    }
  }, [isControlled, value]);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus trap and return for dropdown
  useFocusTrap(dropdownRef, open, true);
  useFocusReturn(open);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Column value generators
  const hourValues = use12Hour
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);
  const minuteValues = generateRange(60, minuteStep);
  const secondValues = generateRange(60, secondStep);

  // Current selections (fallback to midnight)
  const hours = currentValue?.hours ?? 0;
  const minutes = currentValue?.minutes ?? 0;
  const seconds = currentValue?.seconds ?? 0;

  // For 12-hour mode
  const display12Hour = use12Hour ? (hours % 12 || 12) : hours;
  const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";

  // Handlers
  const handleHourChange = (h: number) => {
    let newHours = h;
    if (use12Hour) {
      // Convert 12-hour to 24-hour
      if (period === "AM") {
        newHours = h === 12 ? 0 : h;
      } else {
        newHours = h === 12 ? 12 : h + 12;
      }
    }
    updateValue({
      hours: newHours,
      minutes,
      ...(showSeconds ? { seconds } : {}),
    });
  };

  const handleMinuteChange = (m: number) => {
    updateValue({
      hours,
      minutes: m,
      ...(showSeconds ? { seconds } : {}),
    });
  };

  const handleSecondChange = (s: number) => {
    updateValue({
      hours,
      minutes,
      seconds: s,
    });
  };

  const handlePeriodChange = (p: "AM" | "PM") => {
    let newHours = hours;
    if (p === "AM" && hours >= 12) {
      newHours = hours - 12;
    } else if (p === "PM" && hours < 12) {
      newHours = hours + 12;
    }
    updateValue({
      hours: newHours,
      minutes,
      ...(showSeconds ? { seconds } : {}),
    });
  };

  const handleNow = () => {
    const now = new Date();
    updateValue({
      hours: now.getHours(),
      minutes: now.getMinutes(),
      ...(showSeconds ? { seconds: now.getSeconds() } : {}),
    });
  };

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  // Display text
  const displayText = hasValue
    ? formatTimeValue(currentValue!, use12Hour, showSeconds)
    : null;

  // Trigger button — shared between Field-aware and standalone modes
  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      id={controlId}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={open ? `${controlId}-listbox` : undefined}
      aria-labelledby={insideField ? fieldLabelId : (label ? labelId : undefined)}
      aria-label={!label && !insideField && !fieldLabelId ? "Select time" : undefined}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-required={required || undefined}
      disabled={disabled}
      data-testid="timepicker-trigger"
      className={triggerVariants({ size, error })}
      onClick={handleToggle}
    >
      <Clock
        className={cn(
          "shrink-0 text-white/70",
          size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <span
        className={cn(
          "flex-1 text-left",
          !hasValue && "text-white/70"
        )}
      >
        {displayText ?? placeholder ?? "Select time"}
      </span>
    </button>
  );

  // Hidden input for form submission
  const hiddenInput = name ? (
    <input
      type="hidden"
      name={name}
      value={hasValue ? formatHiddenValue(currentValue!) : ""}
    />
  ) : null;

  // Dropdown — shared between both modes
  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 1, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.2 }}
          data-testid="timepicker-popover"
          className={cn(
            "absolute top-full left-0 z-50 mt-1",
            "bg-bg-200 border border-white/10 rounded-lg shadow-xl p-2"
          )}
        >
          <div id={`${controlId}-listbox`} className="flex" role="group" aria-label="Time selection">
            {/* Hours column */}
            <TimeColumn
              label={use12Hour ? "Hour" : "Hour"}
              values={hourValues}
              selected={display12Hour}
              onChange={handleHourChange}
              isDisabled={
                minTime || maxTime
                  ? (h) => {
                      const actual = use12Hour
                        ? period === "AM"
                          ? h === 12
                            ? 0
                            : h
                          : h === 12
                            ? 12
                            : h + 12
                        : h;
                      return isHourDisabled(actual, minTime, maxTime);
                    }
                  : undefined
              }
            />

            <div className="w-px bg-white/6 mx-1" />

            {/* Minutes column */}
            <TimeColumn
              label="Min"
              values={minuteValues}
              selected={minutes}
              onChange={handleMinuteChange}
              isDisabled={
                minTime || maxTime
                  ? (m) => isMinuteDisabled(hours, m, minTime, maxTime)
                  : undefined
              }
            />

            {/* Seconds column */}
            {showSeconds && (
              <>
                <div className="w-px bg-white/6 mx-1" />
                <TimeColumn
                  label="Sec"
                  values={secondValues}
                  selected={seconds}
                  onChange={handleSecondChange}
                  isDisabled={
                    minTime || maxTime
                      ? (s) =>
                          isSecondDisabled(
                            hours,
                            minutes,
                            s,
                            minTime,
                            maxTime
                          )
                      : undefined
                  }
                />
              </>
            )}

            {/* AM/PM column */}
            {use12Hour && (
              <>
                <div className="w-px bg-white/6 mx-1" />
                <PeriodColumn value={period} onChange={handlePeriodChange} />
              </>
            )}
          </div>

          {/* Now button */}
          <div className="border-t border-white/6 mt-2 pt-2 flex justify-center">
            <button
              type="button"
              className="text-xs text-red hover:text-red/80 cursor-pointer transition-colors"
              onClick={handleNow}
            >
              Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // When inside a Field, render only the core interactive elements
  if (insideField) {
    return (
      <div
        ref={containerRef}
        data-slot="timepicker"
        className={cn("relative inline-flex flex-col gap-1.5", className)}
        {...props}
      >
        {triggerButton}
        {hiddenInput}
        {dropdown}
      </div>
    );
  }

  // Standalone rendering — identical to original
  return (
    <div
      ref={containerRef}
      data-slot="timepicker"
      className={cn("relative inline-flex flex-col gap-1.5", className)}
      {...props}
    >
      {/* Label */}
      {label && (
        <label id={labelId} className="text-sm font-medium text-white/80">
          {label}
          {required && (
            <span className="text-red ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {triggerButton}
      {hiddenInput}
      {dropdown}

      {/* Helper / Error text */}
      {resolvedDescription && !error && (
        <p id={`${controlId}-description`} className="text-xs text-white/70">
          {resolvedDescription}
        </p>
      )}
      {error && errorMessage && (
        <p id={`${controlId}-error`} className="text-xs text-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

TimePicker.displayName = "TimePicker";

export { TimePicker };

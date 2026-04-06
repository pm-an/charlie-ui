"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useFieldAware } from "../hooks/useFieldAware";

/* -------------------------------------------------------------------------- */
/*  CVA variants                                                              */
/* -------------------------------------------------------------------------- */

const slotVariants = cva(
  [
    "relative flex items-center justify-center rounded-md border",
    "bg-bg-subtle text-center font-mono font-semibold text-text-loud",
    "transition-all duration-200",
  ],
  {
    variants: {
      size: {
        sm: "h-9 w-8 text-sm",
        md: "h-11 w-10 text-lg",
        lg: "h-14 w-12 text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const containerVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

export type OTPInputProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof slotVariants> & {
    /** Number of digit slots. @default 6 */
    length?: number;
    /** Controlled value. */
    value?: string;
    /** Uncontrolled default value. */
    defaultValue?: string;
    /** Called whenever the value changes. */
    onChange?: (value: string) => void;
    /** Called when all slots are filled. */
    onComplete?: (value: string) => void;
    /** Disables the input. */
    disabled?: boolean;
    /** Shows error styling. */
    error?: boolean;
    /** Error message displayed below the slots. */
    errorMessage?: string;
    /** Label displayed above the slots. */
    label?: string;
    /** Input type: numeric only or alphanumeric. @default "numeric" */
    type?: "numeric" | "alphanumeric";
    /** Auto-focus the hidden input on mount. */
    autoFocus?: boolean;
    /** Show a separator dash after every N digits. */
    separator?: number;
  };

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

function OTPInput({
  className,
  length = 6,
  value: controlledValue,
  defaultValue,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  errorMessage,
  label,
  size = "md",
  type = "numeric",
  autoFocus = false,
  separator,
  ...props
}: OTPInputProps) {
  const {
    controlId,
    insideField,
    error: resolvedError,
    disabled: resolvedDisabled,
    ariaDescribedBy,
    ariaInvalid,
  } = useFieldAware({ id: undefined, error, disabled, required: undefined, errorMessage });

  const [internalValue, setInternalValue] = useControllableState(
    controlledValue,
    defaultValue ?? "",
    onChange,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const sanitize = (raw: string) => {
    if (type === "numeric") return raw.replace(/[^0-9]/g, "");
    return raw.replace(/[^a-zA-Z0-9]/g, "");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = sanitize(e.target.value).slice(0, length);
    setInternalValue(newValue);
    if (newValue.length === length) onComplete?.(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow natural backspace / arrow key handling by the hidden input
    if (e.key === "Backspace" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
      return;
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = sanitize(e.clipboardData.getData("text")).slice(0, length);
    setInternalValue(pasted);
    if (pasted.length === length) onComplete?.(pasted);
  };

  const handleSlotClick = () => {
    if (!resolvedDisabled) inputRef.current?.focus();
  };

  /* ------ Build slot elements with optional separators ------ */

  const elements: React.ReactNode[] = [];

  for (let i = 0; i < length; i++) {
    const char = internalValue[i] || "";
    const isActive = focused && i === internalValue.length;
    const isFilled = char !== "";

    elements.push(
      <div
        key={`slot-${i}`}
        data-testid={`otp-slot-${i}`}
        className={cn(
          slotVariants({ size }),
          "border-border",
          isActive && "border-border-hover ring-1 ring-border-hover",
          isFilled && "border-border-strong",
          resolvedError && "border-red/50",
          resolvedDisabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {char}
        {isActive && (
          <span className="animate-blink absolute h-5 w-0.5 bg-fg-200" />
        )}
      </div>,
    );

    // Insert separator after every N digits (but not after the last slot)
    if (separator && separator > 0 && (i + 1) % separator === 0 && i < length - 1) {
      elements.push(
        <span
          key={`sep-${i}`}
          data-testid={`otp-separator-${i}`}
          className="px-1 text-lg text-fg-200"
        >
          -
        </span>,
      );
    }
  }

  return (
    <div data-slot="otp-input" className={cn(className)} {...props}>
      {!insideField && label && (
        <label className="mb-1.5 block text-sm font-medium text-fg-200">
          {label}
        </label>
      )}
      <div
        role="group"
        aria-label={label || "One-time password"}
        className={cn(containerVariants({ size }))}
        onClick={handleSlotClick}
        data-testid="otp-container"
      >
        <input
          ref={inputRef}
          id={controlId}
          className="sr-only"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={length}
          autoComplete="one-time-code"
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoFocus={autoFocus}
          disabled={resolvedDisabled}
          aria-label={label || "One-time password"}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          data-testid="otp-hidden-input"
        />
        {elements}
      </div>
      {!insideField && resolvedError && errorMessage && (
        <p id={`${controlId}-error`} role="alert" className="mt-1.5 text-xs text-red">{errorMessage}</p>
      )}
    </div>
  );
}

OTPInput.displayName = "OTPInput";

export { OTPInput, slotVariants, containerVariants };

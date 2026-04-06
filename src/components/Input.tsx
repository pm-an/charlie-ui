"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  /** Description text shown below the input */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      description,
      helperText,
      error: errorProp,
      errorMessage,
      leftIcon,
      rightIcon,
      id,
      disabled: disabledProp,
      required: requiredProp,
      ...props
    },
    ref
  ) => {
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
      id: id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined),
      error: errorProp,
      disabled: disabledProp,
      required: requiredProp,
      description: resolvedDescription,
      errorMessage,
    });

    // Core interactive element — shared between Field-aware and standalone modes
    const inputElement = (
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-fg-200 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          data-slot="input-field"
          id={controlId}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full bg-bg-subtle border border-border rounded-lg h-9 px-3 text-sm text-text-loud",
            "shadow-input placeholder:text-text-muted",
            "outline-none transition-shadow duration-200",
            "focus:shadow-input-focus focus:border-border-hover",
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
            error && "border-red/50 focus:ring-red/30 focus:border-red/50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-fg-200 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
    );

    // When inside a Field, render only the core element
    if (insideField) {
      return inputElement;
    }

    // Standalone rendering — identical to original
    return (
      <div data-slot="input" className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={controlId}
            className="text-sm font-medium text-fg-200"
          >
            {label}
          </label>
        )}
        {inputElement}
        {resolvedDescription && !error && (
          <p id={`${controlId}-description`} className="text-xs text-fg-200">{resolvedDescription}</p>
        )}
        {error && errorMessage && (
          <p id={`${controlId}-error`} className="text-xs text-red">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

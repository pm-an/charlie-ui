"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

const checkboxVariants = cva(
  "relative shrink-0 rounded-[5px] border transition-all duration-200 flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const iconSizeMap = {
  sm: 8,
  md: 10,
  lg: 12,
} as const;

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> &
  VariantProps<typeof checkboxVariants> & {
    checked?: boolean;
    indeterminate?: boolean;
    label?: string;
    description?: string;
    error?: boolean;
    errorMessage?: string;
  };

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      indeterminate = false,
      onChange,
      label,
      description,
      error = false,
      errorMessage,
      disabled,
      size = "md",
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    const {
      controlId,
      insideField,
      error: resolvedError,
      disabled: resolvedDisabled,
      required: resolvedRequired,
      ariaDescribedBy,
      ariaInvalid,
    } = useFieldAware({ id, error, disabled });

    useEffect(() => {
      const input =
        (ref as React.RefObject<HTMLInputElement>)?.current ??
        internalRef.current;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const resolvedSize = size ?? "md";
    const iconSize = iconSizeMap[resolvedSize];

    const isCheckedOrIndeterminate = checked || indeterminate;

    const checkboxElement = (
      <label
        className={cn(
          "relative flex items-center gap-2 select-none",
          resolvedDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <input
          ref={ref ?? internalRef}
          type="checkbox"
          id={controlId}
          checked={checked}
          disabled={resolvedDisabled}
          onChange={onChange}
          className="sr-only"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        <span
          className={cn(
            checkboxVariants({ size }),
            isCheckedOrIndeterminate
              ? "bg-accent border-accent shadow-button"
              : "bg-white/[0.04] border-white/[0.08] shadow-xs",
            resolvedError && !isCheckedOrIndeterminate && "border-red/50"
          )}
          aria-hidden="true"
          data-state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
        >
          <AnimatePresence>
            {checked && !indeterminate && (
              <motion.svg
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                width={iconSize}
                height={iconSize}
                viewBox="0 0 12 12"
                fill="none"
                className="text-white"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
            {indeterminate && (
              <motion.svg
                key="indeterminate"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                width={iconSize}
                height={iconSize}
                viewBox="0 0 12 12"
                fill="none"
                className="text-white"
              >
                <path
                  d="M3 6H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
        {!insideField && (label || description) && (
          <span className="flex flex-col">
            {label && (
              <span className={cn(
                "text-sm font-medium text-white/70",
                resolvedRequired && "after:content-['*'] after:ml-0.5 after:text-[#f87171]"
              )}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-white/70">{description}</span>
            )}
          </span>
        )}
        {insideField && label && (
          <span className={cn(
            "text-sm font-medium text-white/70",
            resolvedRequired && "after:content-['*'] after:ml-0.5 after:text-[#f87171]"
          )}>
            {label}
          </span>
        )}
      </label>
    );

    if (insideField) {
      return checkboxElement;
    }

    return (
      <div data-slot="checkbox" className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          {checkboxElement}
        </div>
        {resolvedError && errorMessage && (
          <p className="text-xs text-[#f87171] ml-6">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };

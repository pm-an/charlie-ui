"use client";

import {
  createContext,
  useContext,
  useMemo,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

/* ── Context ──────────────────────────────── */

type RadioGroupContextValue = {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx)
    throw new Error("RadioGroup.Item must be used within a RadioGroup");
  return ctx;
}

/* ── RadioGroup Root ──────────────────────── */

export type RadioGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
};

const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      onChange,
      name,
      label,
      orientation = "vertical",
      disabled,
      error = false,
      errorMessage,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const {
      controlId,
      insideField,
      error: resolvedError,
      disabled: resolvedDisabled,
      ariaDescribedBy,
      ariaInvalid,
    } = useFieldAware({ id, error, disabled });

    const ctx = useMemo(
      () => ({ name, value, onChange, disabled: resolvedDisabled }),
      [name, value, onChange, resolvedDisabled]
    );

    return (
      <RadioGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="radio-group"
          role="radiogroup"
          id={controlId}
          aria-label={!insideField ? label : undefined}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className={cn("flex flex-col gap-1", className)}
          {...props}
        >
          {!insideField && label && (
            <span className="text-sm font-medium text-white/80 mb-1">
              {label}
            </span>
          )}
          <div
            className={cn(
              "flex gap-3",
              orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
            )}
          >
            {children}
          </div>
          {!insideField && resolvedError && errorMessage && (
            <p className="text-xs text-red mt-1">{errorMessage}</p>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroupRoot.displayName = "RadioGroup";

/* ── RadioGroup.Item ──────────────────────── */

export type RadioGroupItemProps = Omit<
  HTMLAttributes<HTMLLabelElement>,
  "onChange"
> & {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
};

const RadioGroupItem = forwardRef<HTMLLabelElement, RadioGroupItemProps>(
  (
    {
      className,
      value,
      label,
      description,
      disabled: itemDisabled,
      ...props
    },
    ref
  ) => {
    const group = useRadioGroup();
    const isSelected = group.value === value;
    const isDisabled = group.disabled || itemDisabled;

    return (
      <label
        ref={ref}
        className={cn(
          "flex items-start gap-2 select-none",
          isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <input
          type="radio"
          name={group.name}
          value={value}
          checked={isSelected}
          disabled={isDisabled}
          onChange={() => group.onChange?.(value)}
          className="sr-only"
        />
        <span
          className={cn(
            "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
            isSelected
              ? "border-red bg-transparent"
              : "border-white/10 bg-white/5"
          )}
          aria-hidden="true"
        >
          <AnimatePresence>
            {isSelected && (
              <motion.span
                key="dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="block h-2 w-2 rounded-full bg-red"
              />
            )}
          </AnimatePresence>
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-white/80">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-white/40">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroup.Item";

/* ── Compound Export ──────────────────────── */

const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});

export { RadioGroup };

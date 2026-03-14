"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useFieldAware } from "../hooks/useFieldAware";

const switchVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "transition-colors duration-200",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9 p-[2px]",
        md: "h-7 w-12 p-[3px]",
        lg: "h-8 w-14 p-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const thumbSizeMap = {
  sm: { checked: 16, unchecked: 0 },
  md: { checked: 20, unchecked: 0 },
  lg: { checked: 24, unchecked: 0 },
} as const;

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "onChange"
> & VariantProps<typeof switchVariants> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked,
      onChange,
      disabled,
      label,
      description,
      error,
      errorMessage,
      size = "md",
      name,
      id,
      ...props
    },
    ref
  ) => {
    const [checked, setChecked] = useControllableState(
      controlledChecked,
      defaultChecked ?? false,
      onChange
    );

    const {
      controlId,
      insideField,
      error: resolvedError,
      disabled: resolvedDisabled,
      ariaDescribedBy,
      ariaInvalid,
    } = useFieldAware({ id, error, disabled, description, errorMessage });

    const switchId = controlId;
    const labelId = label ? `${switchId}-label` : undefined;
    const descriptionId = description ? `${switchId}-desc` : undefined;

    const resolvedSize = size ?? "md";
    const thumb = thumbSizeMap[resolvedSize];

    // Build aria-describedby: inside Field context use hook's value;
    // standalone: hook builds from description/errorMessage, but Switch's
    // description has a custom id format, so override when standalone
    let effectiveAriaDescribedBy: string | undefined;
    if (insideField) {
      effectiveAriaDescribedBy = ariaDescribedBy;
    } else {
      const parts: string[] = [];
      if (description) parts.push(descriptionId!);
      if (resolvedError && errorMessage) parts.push(`${switchId}-error`);
      effectiveAriaDescribedBy = parts.join(" ") || undefined;
    }

    const switchElement = (
      <label
        data-slot="switch"
        className={cn(
          "inline-flex items-start gap-3",
          resolvedDisabled && "cursor-not-allowed",
          !resolvedDisabled && "cursor-pointer"
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={resolvedDisabled}
          name={name}
          id={switchId}
          onChange={(e) => setChecked(e.target.checked)}
          aria-labelledby={!insideField ? labelId : undefined}
          aria-describedby={effectiveAriaDescribedBy}
          aria-invalid={ariaInvalid}
          {...props}
        />
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={!insideField ? labelId : undefined}
          aria-describedby={effectiveAriaDescribedBy}
          disabled={resolvedDisabled}
          tabIndex={-1}
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            switchVariants({ size }),
            checked ? "bg-accent" : "bg-white/10",
            resolvedDisabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => {
            if (!resolvedDisabled) setChecked(!checked);
          }}
        >
          <motion.span
            className={cn(
              "block rounded-full bg-white shadow-sm",
              resolvedSize === "sm" && "h-4 w-4",
              resolvedSize === "md" && "h-[22px] w-[22px]",
              resolvedSize === "lg" && "h-[26px] w-[26px]"
            )}
            animate={{ x: checked ? thumb.checked : thumb.unchecked }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        {!insideField && (label || description) && (
          <div className="flex flex-col gap-0.5 pt-0.5">
            {label && (
              <span
                id={labelId}
                className="text-sm font-medium text-white/80 select-none"
              >
                {label}
              </span>
            )}
            {description && (
              <span
                id={descriptionId}
                className="text-xs text-white/60 select-none"
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );

    if (insideField) {
      return switchElement;
    }

    if (resolvedError && errorMessage) {
      return (
        <div className="flex flex-col gap-1">
          {switchElement}
          <p id={`${switchId}-error`} className="text-xs text-red" role="alert">{errorMessage}</p>
        </div>
      );
    }

    return switchElement;
  }
);

Switch.displayName = "Switch";

export { Switch, switchVariants };

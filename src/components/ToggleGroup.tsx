"use client";

import { type HTMLAttributes, type ReactNode, useId, useRef } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useFieldAware } from "../hooks/useFieldAware";
import { useRovingTabIndex } from "../hooks/useRovingTabIndex";

export interface ToggleGroupOption {
  /** Text label for the option */
  label: string;
  /** Unique value identifier */
  value: string;
  /** Optional icon rendered before the label */
  icon?: ReactNode;
  /** Whether this individual option is disabled */
  disabled?: boolean;
}

export type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  options: ToggleGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

function ToggleGroup({
  className,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}: ToggleGroupProps) {
  const [value, setValue] = useControllableState(
    controlledValue,
    defaultValue ?? options[0]?.value ?? "",
    onChange
  );
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { ariaDescribedBy, ariaInvalid } = useFieldAware({
    id: undefined,
    error: undefined,
    disabled: undefined,
    required: undefined,
  });

  const { onKeyDown } = useRovingTabIndex(containerRef, {
    direction: "horizontal",
    loop: true,
    itemSelector: '[role="radio"]:not([disabled])',
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    // Let the roving hook handle focus movement
    onKeyDown(e);

    // After roving hook moved focus, read the new focused element's value
    const newFocused = document.activeElement as HTMLElement;
    const newValue = newFocused?.getAttribute("data-value");
    if (newValue && newValue !== value) {
      setValue(newValue);
    }
  };

  return (
    <LayoutGroup id={id}>
      <div
        ref={containerRef}
        className={cn("inline-flex rounded-full bg-white/5 p-1", className)}
        role="radiogroup"
        data-slot="toggle-group"
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {options.map((option) => {
          const isActive = option.value === value;
          const isDisabled = option.disabled === true;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-disabled={isDisabled || undefined}
              disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              data-state={isActive ? "active" : "inactive"}
              data-value={option.value}
              className={cn(
                "relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isDisabled
                  ? "cursor-not-allowed opacity-40"
                  : isActive
                    ? "text-[#18191a]"
                    : "text-white/60 hover:text-white"
              )}
              onClick={() => {
                if (!isDisabled) setValue(option.value);
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="toggle-group-active"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 35 }
                  }
                />
              )}
              {option.icon && (
                <span className="inline-flex shrink-0 [&>svg]:size-4" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };

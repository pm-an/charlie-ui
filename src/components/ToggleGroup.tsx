import { type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export interface ToggleGroupOption {
  label: string;
  value: string;
}

export type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  options: ToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
};

function ToggleGroup({
  className,
  options,
  value,
  onChange,
  ...props
}: ToggleGroupProps) {
  return (
    <div
      className={cn("inline-flex rounded-full bg-white/5 p-1", className)}
      role="radiogroup"
      {...props}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={cn(
              "relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-[#18191a]"
                : "text-white/60 hover:text-white"
            )}
            onClick={() => onChange(option.value)}
          >
            {isActive && (
              <motion.span
                layoutId="toggle-group-active"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };

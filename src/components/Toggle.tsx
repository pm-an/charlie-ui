import { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

function Toggle({
  className,
  checked = false,
  onChange,
  disabled,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "transition-colors duration-200",
        checked ? "bg-red" : "bg-white/10",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => onChange?.(!checked)}
      {...props}
    >
      <motion.span
        className="block h-5 w-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

Toggle.displayName = "Toggle";

export { Toggle };

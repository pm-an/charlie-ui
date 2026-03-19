import { type LabelHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
  disabled?: boolean;
};

function Label({
  className,
  children,
  required,
  disabled,
  ...props
}: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium text-white/80",
        disabled && "opacity-65 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  );
}

Label.displayName = "Label";

export { Label };

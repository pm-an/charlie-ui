import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const dividerVariants = cva("w-full", {
  variants: {
    variant: {
      solid: "h-px bg-white/6",
      dotted: "h-0 border-t border-dotted border-white/10",
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

export type DividerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerVariants> & {
    label?: string;
  };

function Divider({ className, variant, label, ...props }: DividerProps) {
  if (label) {
    return (
      <div
        data-slot="divider"
        className={cn("flex items-center gap-3 w-full", className)}
        role="separator"
        {...props}
      >
        <div className={cn(dividerVariants({ variant }), "flex-1")} />
        <span className="text-xs text-white/60 shrink-0">{label}</span>
        <div className={cn(dividerVariants({ variant }), "flex-1")} />
      </div>
    );
  }

  return (
    <div
      data-slot="divider"
      className={cn(dividerVariants({ variant }), className)}
      role="separator"
      {...props}
    />
  );
}

Divider.displayName = "Divider";

export { Divider, dividerVariants };

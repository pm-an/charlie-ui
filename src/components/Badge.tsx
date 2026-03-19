import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg font-medium shadow-xs border border-white/[0.04] tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-white/[0.06] text-white/70",
        primary: "bg-accent-muted text-accent",
        blue: "bg-blue-muted text-blue",
        green: "bg-green-muted text-green",
        yellow: "bg-yellow-muted text-yellow",
        pro: "bg-blue-muted text-blue",
      },
      size: {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-sm px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };

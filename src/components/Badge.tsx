import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-white/5 text-white/60",
        red: "bg-[rgba(255,99,99,0.15)] text-red",
        blue: "bg-blue-muted text-blue",
        green: "bg-green-muted text-green",
        yellow: "bg-yellow-muted text-yellow",
        pro: "bg-[rgba(162,223,253,0.15)] text-[#A2DFFD]",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2 py-0.5",
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
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };

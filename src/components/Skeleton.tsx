import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const skeletonVariants = cva("bg-white/10 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:animate-[skeleton-shimmer_1.5s_ease-in-out_infinite]", {
  variants: {
    variant: {
      text: "rounded-md w-full h-4",
      circle: "rounded-full aspect-square",
      rect: "rounded-md",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export type SkeletonProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants> & {
    width?: string | number;
    height?: string | number;
    /** Accessible label for the loading state. Defaults to "Loading". */
    loadingLabel?: string;
  };

function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  loadingLabel = "Loading",
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      role="status"
      aria-label={loadingLabel}
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
        ...style,
      }}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };

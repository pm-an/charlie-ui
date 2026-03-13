import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const skeletonVariants = cva("bg-white/5 animate-pulse", {
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
  };

function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
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

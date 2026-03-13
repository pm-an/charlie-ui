import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const containerVariants = cva("mx-auto px-4 sm:px-6", {
  variants: {
    size: {
      sm: "max-w-[746px]",
      md: "max-w-[960px]",
      lg: "max-w-[1080px]",
      xl: "max-w-[1280px]",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

export type ContainerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants>;

function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  );
}

Container.displayName = "Container";

export { Container, containerVariants };

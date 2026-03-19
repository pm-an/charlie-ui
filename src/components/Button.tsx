import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Slot } from "../utils/Slot";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-medium transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "shadow-button hover:shadow-button-hover",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent hover:bg-accent/90 text-white",
          "shadow-button hover:shadow-button-hover",
        ],
        neutral: [
          "bg-button-bg hover:bg-button-bg-hover text-button-fg",
          "shadow-button hover:shadow-button-hover",
        ],
        secondary: [
          "border border-white/10 hover:border-white/15",
          "bg-white/[0.03] hover:bg-white/[0.06] text-white",
          "shadow-xs hover:shadow-soft",
        ],
        ghost: [
          "bg-transparent hover:bg-white/5",
          "text-white/70 hover:text-white",
          "shadow-none hover:shadow-xs",
        ],
        danger: [
          "bg-red hover:bg-red/90 text-white",
          "shadow-button hover:shadow-button-hover",
        ],
      },
      size: {
        sm: "min-h-7 px-2.5 py-0.5 text-xs",
        md: "min-h-8 px-3 py-1 text-sm",
        lg: "min-h-10 px-5 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="button"
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children as React.ReactElement}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size="xs" color="currentColor" label="Loading" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Slot } from "../utils/Slot";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  [
    "group inline-flex items-center justify-center gap-2",
    "rounded-md font-medium transition-all duration-200",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent hover:bg-accent/90 text-white",
        ],
        neutral: [
          "bg-button-bg hover:bg-button-bg-hover text-button-fg",
          "shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.3)]",
        ],
        secondary: [
          "border border-white/10 hover:border-white/15",
          "bg-transparent text-white",
        ],
        ghost: [
          "bg-transparent hover:bg-white/5",
          "text-white/70 hover:text-white",
        ],
        danger: [
          "bg-red hover:bg-red/90 text-white",
        ],
      },
      size: {
        sm: "min-h-8 px-3 py-1 text-sm",
        md: "min-h-10 px-4 py-2 text-sm",
        lg: "min-h-12 px-6 py-3 text-base",
        iconSm: "min-h-7 w-7 p-0 text-xs",
        icon: "min-h-8 w-8 p-0 text-sm",
        iconLg: "min-h-10 w-10 p-0 text-sm",
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
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

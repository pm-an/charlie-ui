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
          "bg-accent-dim hover:bg-accent-dim/90 text-fg-on-accent",
        ],
        neutral: [
          "bg-button-bg hover:bg-button-bg-hover text-button-fg",
          "shadow-soft",
        ],
        secondary: [
          "border border-border-strong hover:border-border-hover",
          "bg-transparent text-text-loud",
        ],
        ghost: [
          "bg-transparent hover:bg-bg-subtle",
          "text-fg-200 hover:text-text-loud",
        ],
        danger: [
          "bg-red-dim hover:bg-red-dim/90 text-fg-on-accent",
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
    /** Small badge rendered at a corner of the button */
    badge?: ReactNode;
    /** Which corner to place the badge */
    badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
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
      badge,
      badgePosition = "top-right",
      ...props
    },
    ref
  ) => {
    const badgePositionClasses = {
      "top-left": "-top-2 -left-2",
      "top-right": "-top-2 -right-2",
      "bottom-left": "-bottom-2 -left-2",
      "bottom-right": "-bottom-2 -right-2",
    };

    const badgeEl = badge != null && (
      <span className={cn(
        "absolute flex items-center justify-center rounded-full bg-green/20 backdrop-blur-sm border border-green/30 px-1.5 py-0.5 text-[10px] font-bold leading-none text-green shadow-sm",
        badgePositionClasses[badgePosition]
      )}>
        {badge}
      </span>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="button"
          className={cn(buttonVariants({ variant, size }), badge != null && "relative", className)}
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
        className={cn(buttonVariants({ variant, size }), badge != null && "relative", className)}
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
        {badgeEl}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

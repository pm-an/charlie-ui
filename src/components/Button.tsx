import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md font-medium transition-all duration-200",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-white/80 hover:bg-white text-[#18191a]",
          "shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.3)]",
        ],
        secondary: [
          "border border-white/10 hover:border-white/15",
          "bg-transparent text-white",
        ],
        ghost: [
          "bg-transparent hover:bg-white/5",
          "text-white/60 hover:text-white",
        ],
        danger: [
          "bg-red hover:bg-red/90 text-white",
        ],
        brand: [
          "bg-[#ff6363] hover:bg-[#ff6363]/90 text-white",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const spinnerClasses = "animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loading?: boolean;
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
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className={spinnerClasses} />
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

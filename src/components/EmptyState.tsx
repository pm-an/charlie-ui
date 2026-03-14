import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Inbox } from "lucide-react";

const emptyStateVariants = cva(
  "flex flex-col items-center text-center",
  {
    variants: {
      size: {
        sm: "py-6",
        md: "py-10",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const iconContainerVariants = cva(
  "rounded-full bg-white/5 flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const iconVariants = cva("text-white/70", {
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const titleVariants = cva("font-medium text-white mt-4", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const descriptionVariants = cva("text-white/70 mt-1", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
  };

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      icon,
      title,
      description,
      action,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size || "md";

    return (
      <div
        ref={ref}
        data-slot="empty-state"
        className={cn(emptyStateVariants({ size }), className)}
        {...props}
      >
        <div className={iconContainerVariants({ size: resolvedSize })}>
          <span className={iconVariants({ size: resolvedSize })}>
            {icon || <Inbox className="h-full w-full" />}
          </span>
        </div>

        <h3 className={titleVariants({ size: resolvedSize })}>{title}</h3>

        {description && (
          <p className={descriptionVariants({ size: resolvedSize })}>
            {description}
          </p>
        )}

        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export {
  EmptyState,
  emptyStateVariants,
  iconContainerVariants,
  iconVariants,
  titleVariants,
  descriptionVariants,
};

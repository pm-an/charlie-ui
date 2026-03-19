import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Slot } from "../utils/Slot";
import { Skeleton } from "./Skeleton";

/* ─── Card Root ─────────────────────────────── */

const cardVariants = cva(
  "rounded-xl shadow-card transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-card-hover transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-card-gradient border border-white/[0.06]",
        translucent:
          "bg-card-gradient-translucent backdrop-blur-xl border border-white/[0.06]",
        outline: "bg-transparent border border-white/10",
        featured: [
          "bg-card-gradient border border-white/[0.06]",
          "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1),0_1px_40px_0_rgba(154,170,255,0.05),0_0_16px_-7px_rgba(154,170,255,0.05),0_2px_40px_10px_rgba(154,170,255,0.05)]",
        ],
        glass: [
          "bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        ],
        elevated: [
          "bg-grey-700 border border-white/[0.08]",
          "shadow-elevated",
        ],
      },
      padding: {
        none: "",
        default: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
    loading?: boolean;
    interactive?: boolean;
  };

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, asChild = false, loading = false, interactive = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="card"
          className={cn(
            cardVariants({ variant, padding }),
            interactive && "cursor-pointer hover:-translate-y-0.5",
            className
          )}
          {...props}
        >
          {children as React.ReactElement}
        </Slot>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="card"
        aria-busy={loading || undefined}
        className={cn(
          cardVariants({ variant, padding }),
          interactive && "cursor-pointer hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <Skeleton variant="text" height={16} width="60%" />
            <Skeleton variant="text" height={12} width="80%" />
            <Skeleton variant="text" height={12} width="40%" />
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
CardRoot.displayName = "Card";

/* ─── Card.Header ───────────────────────────── */

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  title?: string;
  description?: string;
};

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex items-center gap-3 pb-4", className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {(title || description) && (
        <div className="min-w-0">
          {title && (
            <h3 className="text-white font-semibold text-base">{title}</h3>
          )}
          {description && (
            <p className="text-white/70 text-sm">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
);
CardHeader.displayName = "Card.Header";

/* ─── Card.Body ─────────────────────────────── */

const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-body" className={cn(className)} {...props} />
  )
);
CardBody.displayName = "Card.Body";

/* ─── Card.Footer ───────────────────────────── */

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("pt-4 border-t border-white/[0.06]", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "Card.Footer";

/* ─── Compound Export ───────────────────────── */

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { Card, cardVariants };
export type { CardProps };

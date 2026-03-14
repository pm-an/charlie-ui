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
  "rounded-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]",
  {
    variants: {
      variant: {
        default: "bg-card-gradient border border-white/[0.06]",
        translucent:
          "bg-card-gradient-translucent backdrop-blur-xl border border-white/[0.06]",
        outline: "bg-transparent border border-white/10",
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
  };

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, asChild = false, loading = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="card"
          className={cn(cardVariants({ variant, padding }), className)}
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
        className={cn(cardVariants({ variant, padding }), className)}
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

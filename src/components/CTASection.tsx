import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const ctaSectionVariants = cva("py-12 md:py-20", {
  variants: {
    variant: {
      simple: "relative",
      gradient: "relative",
      split: "relative",
    },
  },
  defaultVariants: {
    variant: "simple",
  },
});

export type CTASectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof ctaSectionVariants> & {
    title: string;
    description: string;
    actions?: ReactNode;
    align?: "left" | "center";
  };

const CTASection = forwardRef<HTMLElement, CTASectionProps>(
  (
    {
      className,
      variant = "simple",
      title,
      description,
      actions,
      align = "center",
      ...props
    },
    ref
  ) => {
    const isCentered = align === "center";
    const isSplit = variant === "split";

    return (
      <section
        ref={ref}
        data-slot="cta-section"
        className={cn(ctaSectionVariants({ variant }), className)}
        {...props}
      >
        {variant === "gradient" && (
          <div className="bg-aurora absolute inset-0 pointer-events-none" />
        )}

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
          {isSplit ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12">
              <div className="flex-1">
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
                <p className="text-white/60 text-base md:text-lg mt-3 md:mt-4 max-w-xl">
                  {description}
                </p>
              </div>
              {actions && (
                <div className="flex gap-4 shrink-0">{actions}</div>
              )}
            </div>
          ) : (
            <div className={cn(isCentered && "text-center")}>
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                {title}
              </h2>
              <p
                className={cn(
                  "text-white/60 text-base md:text-lg mt-3 md:mt-4 max-w-2xl",
                  isCentered && "mx-auto"
                )}
              >
                {description}
              </p>
              {actions && (
                <div
                  className={cn(
                    "flex gap-4 mt-6 md:mt-8",
                    isCentered && "justify-center"
                  )}
                >
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
);

CTASection.displayName = "CTASection";

export { CTASection, ctaSectionVariants };

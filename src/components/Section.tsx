import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const sectionVariants = cva("", {
  variants: {
    size: {
      sm: "py-8 md:py-12",
      md: "py-12 md:py-20",
      lg: "py-20 md:py-32",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    eyebrow?: string;
    title?: string;
    description?: string;
    children?: ReactNode;
    align?: "left" | "center";
  };

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    className,
    size,
    eyebrow,
    title,
    description,
    children,
    align = "center",
    ...props
  },
  ref
) {
  const isCentered = align === "center";

  return (
    <section
      ref={ref}
      data-slot="section"
      className={cn(sectionVariants({ size }), className)}
      {...props}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {(eyebrow || title || description) && (
          <div className={cn(isCentered && "text-center")}>
            {eyebrow && (
              <p className="text-accent text-sm font-medium tracking-widest uppercase mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-loud text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1]">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "text-fg-300 text-base md:text-lg mt-3 md:mt-4 max-w-2xl",
                  isCentered && "mx-auto"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children && <div className="mt-8 md:mt-12">{children}</div>}
      </div>
    </section>
  );
});

Section.displayName = "Section";

export { Section, sectionVariants };

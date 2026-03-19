import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const heroVariants = cva("relative", {
  variants: {
    variant: {
      centered: "pt-20 md:pt-32 pb-12 md:pb-20",
      split: "pt-20 md:pt-32 pb-12 md:pb-20",
    },
  },
  defaultVariants: {
    variant: "centered",
  },
});

export type HeroProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof heroVariants> & {
    eyebrow?: string;
    title: string;
    description: string;
    actions?: ReactNode;
    children?: ReactNode;
    gradient?: boolean;
  };

function Hero({
  className,
  variant = "centered",
  eyebrow,
  title,
  description,
  actions,
  children,
  gradient = false,
  ...props
}: HeroProps) {
  const isCentered = variant === "centered";

  return (
    <section
      data-slot="hero"
      className={cn(heroVariants({ variant }), className)}
      {...props}
    >
      {gradient && (
        <div className="bg-aurora absolute inset-0 pointer-events-none" />
      )}

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
        {isCentered ? (
          <div className="text-center">
            {eyebrow && (
              <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              {title}
            </h1>
            <p className="text-white/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mt-4 md:mt-6 leading-relaxed">
              {description}
            </p>
            {actions && (
              <div className="flex gap-4 justify-center mt-8">{actions}</div>
            )}
            {children && <div className="mt-12">{children}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              {eyebrow && (
                <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                {title}
              </h1>
              <p className="text-white/60 text-base md:text-lg lg:text-xl mt-4 md:mt-6 leading-relaxed">
                {description}
              </p>
              {actions && (
                <div className="flex gap-4 mt-8">{actions}</div>
              )}
            </div>
            {children && <div>{children}</div>}
          </div>
        )}
      </div>
    </section>
  );
}

Hero.displayName = "Hero";

export { Hero, heroVariants };

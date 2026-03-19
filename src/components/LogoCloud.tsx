import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const logoCloudVariants = cva("", {
  variants: {
    variant: {
      grid: "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12",
      inline: "flex flex-wrap items-center justify-center gap-8 md:gap-12",
    },
  },
  defaultVariants: {
    variant: "grid",
  },
});

export type LogoItem = {
  src: string;
  alt: string;
  href?: string;
};

export type LogoCloudProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof logoCloudVariants> & {
    eyebrow?: string;
    title?: string;
    logos: LogoItem[];
  };

const LogoCloud = forwardRef<HTMLElement, LogoCloudProps>(
  (
    { className, variant = "grid", eyebrow, title, logos, ...props },
    ref
  ) => {
    const hasHeader = eyebrow || title;

    return (
      <section
        ref={ref}
        data-slot="logo-cloud"
        className={cn("py-12 md:py-20", className)}
        {...props}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {hasHeader && (
            <div className="text-center mb-8 md:mb-12">
              {eyebrow && (
                <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
              )}
            </div>
          )}

          <div className={cn(logoCloudVariants({ variant }))}>
            {logos.map((logo) => {
              const imageContent = (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-200"
                />
              );

              return logo.href ? (
                <a
                  key={logo.alt}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  {imageContent}
                </a>
              ) : (
                <div
                  key={logo.alt}
                  className="flex items-center justify-center"
                >
                  {imageContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);

LogoCloud.displayName = "LogoCloud";

export { LogoCloud, logoCloudVariants };

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const featureCardVariants = cva(
  [
    "bg-card-gradient rounded-xl border border-white/[0.06]",
    "hover:border-white/10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "transform-gpu hover:-translate-y-0.5 shadow-card hover:shadow-card-hover",
  ],
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-0",
      },
      glow: {
        true: "hover:glow-subtle",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      glow: false,
    },
  }
);

export type FeatureCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof featureCardVariants> & {
    icon: ReactNode;
    title: string;
    description: string;
    href?: string;
    image?: string;
    iconAlign?: "left" | "center" | "right";
    textAlign?: "left" | "center" | "right";
  };

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    { className, icon, title, description, href, image, size, glow, iconAlign = "left", textAlign = "left", ...props },
    ref
  ) => {
    const content = (
      <>
        {size === "lg" && image && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className={cn(
          size === "lg" && "p-6",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right",
        )}>
          <div className={cn(
            "mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5",
            iconAlign === "center" && "mx-auto",
            iconAlign === "right" && "ml-auto",
          )}>
            <span className="text-white/80">{icon}</span>
          </div>
          <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-white/70">{description}</p>
        </div>
      </>
    );

    const classes = cn(featureCardVariants({ size, glow }), className);

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          data-slot="feature-card"
          className={cn(classes, "block no-underline")}
        >
          {content}
        </a>
      );
    }

    return (
      <div ref={ref} data-slot="feature-card" className={classes} {...props}>
        {content}
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard, featureCardVariants };

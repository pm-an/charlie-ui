import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { FeatureCard } from "./FeatureCard";
import { Section } from "./Section";

export interface FeatureSectionFeature {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  image?: string;
}

export type FeatureSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  features: FeatureSectionFeature[];
  variant?: "grid" | "alternating";
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const FeatureSection = forwardRef<HTMLElement, FeatureSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      features,
      variant = "grid",
      columns = 3,
      ...props
    },
    ref
  ) => {
    return (
      <Section
        ref={ref}
        data-slot="feature-section"
        eyebrow={eyebrow}
        title={title}
        description={description}
        className={className}
        {...props}
      >
        {variant === "grid" ? (
          <div className={cn("grid gap-6", columnClasses[columns])}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                image={feature.image}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-12 md:space-y-20">
            {features.map((feature, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12",
                    isReversed && "md:[&>:first-child]:order-2"
                  )}
                >
                  {/* Image */}
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
                    {feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-white/20 text-sm">
                          Feature image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <span className="text-white/80">{feature.icon}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white md:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/60 md:text-base">
                      {feature.description}
                    </p>
                    {feature.href && (
                      <a
                        href={feature.href}
                        className="mt-4 inline-flex items-center text-sm font-medium text-red hover:underline"
                      >
                        Learn more &rarr;
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    );
  }
);

FeatureSection.displayName = "FeatureSection";

export { FeatureSection };

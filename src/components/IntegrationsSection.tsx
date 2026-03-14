"use client";

import {
  forwardRef,
  useState,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export type Integration = {
  name: string;
  icon: ReactNode;
  description?: string;
  category?: string;
  href?: string;
};

export type IntegrationsSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  integrations: Integration[];
  showCategories?: boolean;
};

const IntegrationsSection = forwardRef<HTMLElement, IntegrationsSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      integrations,
      showCategories = false,
      ...props
    },
    ref
  ) => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = useMemo(() => {
      if (!showCategories) return [];
      const cats = new Set<string>();
      integrations.forEach((integration) => {
        if (integration.category) cats.add(integration.category);
      });
      return ["All", ...Array.from(cats)];
    }, [integrations, showCategories]);

    const filteredIntegrations = useMemo(() => {
      if (!showCategories || activeCategory === "All") return integrations;
      return integrations.filter((i) => i.category === activeCategory);
    }, [integrations, activeCategory, showCategories]);

    const CardWrapper = ({
      integration,
      children,
    }: {
      integration: Integration;
      children: ReactNode;
    }) => {
      if (integration.href) {
        return (
          <a
            href={integration.href}
            className="bg-card-gradient rounded-xl border border-white/[0.06] p-4 hover:border-white/15 transition-colors duration-200 block"
            aria-label={integration.name}
          >
            {children}
          </a>
        );
      }
      return (
        <div className="bg-card-gradient rounded-xl border border-white/[0.06] p-4 hover:border-white/15 transition-colors duration-200">
          {children}
        </div>
      );
    };

    return (
      <section
        ref={ref}
        data-slot="integrations-section"
        className={cn("py-12 md:py-20", className)}
        {...props}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {(eyebrow || title || description) && (
            <div className="text-center">
              {eyebrow && (
                <p className="text-red text-sm font-medium tracking-wide uppercase mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-white/60 text-base md:text-lg mt-3 md:mt-4 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 md:mt-12">
            {showCategories && categories.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                      activeCategory === category
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredIntegrations.map((integration) => (
                <CardWrapper key={integration.name} integration={integration}>
                  <div className="h-10 w-10 flex items-center justify-center text-white/60 mb-3">
                    {integration.icon}
                  </div>
                  <p className="text-sm font-medium text-white">
                    {integration.name}
                  </p>
                  {integration.description && (
                    <p className="mt-1 text-xs text-white/40">
                      {integration.description}
                    </p>
                  )}
                </CardWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

IntegrationsSection.displayName = "IntegrationsSection";

export { IntegrationsSection };

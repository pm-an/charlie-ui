import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { PricingCard, type PricingCardProps } from "./PricingCard";
import { Section } from "./Section";

export interface PricingSectionPlan
  extends Omit<PricingCardProps, "price" | "className" | "style"> {
  price?: string;
  monthlyPrice?: string;
  annualPrice?: string;
}

export type PricingSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  plans: PricingSectionPlan[];
  billingLabel?: { monthly: string; annual: string };
};

const PricingSection = forwardRef<HTMLElement, PricingSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      plans,
      billingLabel = { monthly: "Monthly", annual: "Annual" },
      ...props
    },
    ref
  ) => {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

    const hasBillingToggle = plans.some(
      (plan) => plan.monthlyPrice && plan.annualPrice
    );

    return (
      <Section
        ref={ref}
        data-slot="pricing-section"
        eyebrow={eyebrow}
        title={title}
        description={description}
        className={className}
        {...props}
      >
        {hasBillingToggle && (
          <div className="mb-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billing === "monthly" ? "text-text-loud" : "text-fg-200"
              )}
            >
              {billingLabel.monthly}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={billing === "annual"}
              aria-label="Toggle billing period"
              onClick={() =>
                setBilling((b) => (b === "monthly" ? "annual" : "monthly"))
              }
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border-strong transition-colors",
                billing === "annual" ? "bg-bg-subtle-hover" : "bg-bg-subtle"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block h-4 w-4 rounded-full bg-text-loud shadow-sm transition-transform",
                  billing === "annual" ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billing === "annual" ? "text-text-loud" : "text-fg-200"
              )}
            >
              {billingLabel.annual}
            </span>
          </div>
        )}

        <div
          className={cn(
            "grid gap-6",
            "grid-cols-1 md:grid-cols-2",
            plans.length >= 3 && "lg:grid-cols-3",
            plans.length >= 4 && "xl:grid-cols-4"
          )}
        >
          {plans.map((plan) => {
            const {
              price: planPrice,
              monthlyPrice,
              annualPrice: planAnnualPrice,
              ...cardProps
            } = plan;

            const resolvedPrice =
              monthlyPrice && planAnnualPrice
                ? billing === "monthly"
                  ? monthlyPrice
                  : planAnnualPrice
                : (planPrice ?? "");

            return (
              <PricingCard
                key={plan.tier}
                {...cardProps}
                price={resolvedPrice}
              />
            );
          })}
        </div>
      </Section>
    );
  }
);

PricingSection.displayName = "PricingSection";

export { PricingSection };

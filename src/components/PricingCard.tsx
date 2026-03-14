import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Check } from "lucide-react";

export type PricingCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  annualPrice?: string;
  onCtaClick?: () => void;
};

const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      tier,
      price,
      period,
      description,
      features,
      cta,
      highlighted = false,
      badge,
      annualPrice,
      onCtaClick,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="pricing-card"
      className={cn(
        "bg-card-gradient rounded-xl border p-6 flex flex-col",
        highlighted
          ? "border-white/15 shadow-card-elevated"
          : "border-white/[0.06]",
        className
      )}
      {...props}
    >
      {/* Tier + Badge */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">{tier}</h3>
        {badge && (
          <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
            {badge}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-white/70">{description}</p>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl md:text-4xl font-bold text-white">{price}</span>
        <span className="text-sm text-white/70">/ {period}</span>
      </div>

      {annualPrice && (
        <p className="mt-1 text-sm text-white/70 line-through">
          {annualPrice}
        </p>
      )}

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          "mt-6 w-full rounded-md px-4 py-2.5 min-h-[44px] text-sm font-medium transition-all duration-200 active:scale-[0.98]",
          highlighted
            ? "bg-white/80 hover:bg-white text-[#18191a]"
            : "border border-white/10 hover:border-white/15 bg-transparent text-white"
        )}
      >
        {cta}
      </button>
    </div>
  )
);

PricingCard.displayName = "PricingCard";

export { PricingCard };

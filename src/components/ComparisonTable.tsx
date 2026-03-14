import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Check, X } from "lucide-react";

export interface ComparisonPlan {
  name: string;
  price?: string;
  period?: string;
  highlighted?: boolean;
  cta?: string;
  onCtaClick?: () => void;
}

export interface ComparisonFeature {
  name: string;
  category?: string;
  values: (boolean | string)[];
}

export type ComparisonTableProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: string;
  description?: string;
  plans: ComparisonPlan[];
  features: ComparisonFeature[];
};

const ComparisonTable = forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ className, title, description, plans, features, ...props }, ref) => {
    const categories = Array.from(
      new Set(features.map((f) => f.category).filter(Boolean))
    ) as string[];
    const hasCategories = categories.length > 0;

    const groupedFeatures = hasCategories
      ? categories.map((cat) => ({
          category: cat,
          features: features.filter((f) => f.category === cat),
        }))
      : [{ category: null, features }];

    return (
      <div
        ref={ref}
        data-slot="comparison-table"
        className={cn("w-full", className)}
        {...props}
      >
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-white/70">{description}</p>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="sticky top-0 z-10">
                <th className="p-4 text-left" scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={cn(
                      "p-4 text-center",
                      plan.highlighted &&
                        "border-x border-t border-white/15 bg-white/[0.02] rounded-t-lg"
                    )}
                  >
                    <div className="text-base font-semibold text-white">
                      {plan.name}
                    </div>
                    {plan.price && (
                      <div className="mt-1 flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-white">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-sm text-white/70">
                            / {plan.period}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedFeatures.map((group, gi) => (
                <FeatureGroup key={gi} group={group} plans={plans} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-4" />
                {plans.map((plan) => (
                  <td
                    key={plan.name}
                    className={cn(
                      "p-4 text-center",
                      plan.highlighted &&
                        "border-x border-b border-white/15 bg-white/[0.02] rounded-b-lg"
                    )}
                  >
                    {plan.cta && (
                      <button
                        type="button"
                        onClick={plan.onCtaClick}
                        className={cn(
                          "w-full rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                          plan.highlighted
                            ? "bg-white/80 hover:bg-white text-[#18191a]"
                            : "border border-white/10 hover:border-white/15 bg-transparent text-white"
                        )}
                      >
                        {plan.cta}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
);

function FeatureGroup({
  group,
  plans,
}: {
  group: { category: string | null; features: ComparisonFeature[] };
  plans: ComparisonPlan[];
}) {
  return (
    <>
      {group.category && (
        <tr>
          <td
            colSpan={plans.length + 1}
            className="px-4 pb-2 pt-6 text-sm font-medium uppercase tracking-wider text-white/70"
          >
            {group.category}
          </td>
        </tr>
      )}
      {group.features.map((feature) => (
        <tr
          key={feature.name}
          className="border-b border-white/[0.06]"
        >
          <th scope="row" className="p-4 text-sm text-white text-left font-normal">{feature.name}</th>
          {feature.values.map((value, vi) => (
            <td
              key={vi}
              className={cn(
                "p-4 text-center",
                plans[vi]?.highlighted &&
                  "border-x border-white/15 bg-white/[0.02]"
              )}
            >
              {typeof value === "boolean" ? (
                value ? (
                  <Check
                    className="mx-auto h-5 w-5 text-green-400"
                    aria-label="Included"
                  />
                ) : (
                  <X
                    className="mx-auto h-5 w-5 text-white/70"
                    aria-label="Not included"
                  />
                )
              ) : (
                <span className="text-sm text-white/70">{value}</span>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

ComparisonTable.displayName = "ComparisonTable";

export { ComparisonTable };

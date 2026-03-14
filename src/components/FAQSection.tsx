import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Accordion } from "./Accordion";

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FAQItem[];
  columns?: 1 | 2;
};

const FAQSection = forwardRef<HTMLElement, FAQSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      items,
      columns = 1,
      ...props
    },
    ref
  ) => {
    const hasHeader = eyebrow || title || description;

    const renderAccordion = (faqItems: FAQItem[], keyPrefix = "") => (
      <Accordion mode="single">
        {faqItems.map((item, index) => (
          <Accordion.Item
            key={`${keyPrefix}${index}`}
            value={`${keyPrefix}${index}`}
            title={item.question}
          >
            {item.answer}
          </Accordion.Item>
        ))}
      </Accordion>
    );

    const midpoint = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, midpoint);
    const rightItems = items.slice(midpoint);

    return (
      <section
        ref={ref}
        data-slot="faq-section"
        className={cn("py-12 md:py-20", className)}
        {...props}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {hasHeader && (
            <div className="text-center mb-8 md:mb-12">
              {eyebrow && (
                <p className="text-[#f87171] text-sm font-medium tracking-wide uppercase mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-white/70 text-base md:text-lg mt-3 md:mt-4 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          {columns === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12">
              <div>{renderAccordion(leftItems, "left-")}</div>
              <div>{renderAccordion(rightItems, "right-")}</div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {renderAccordion(items)}
            </div>
          )}
        </div>
      </section>
    );
  }
);

FAQSection.displayName = "FAQSection";

export { FAQSection };

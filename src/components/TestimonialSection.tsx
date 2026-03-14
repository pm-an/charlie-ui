import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Testimonial } from "./Testimonial";
import { Section } from "./Section";

export interface TestimonialSectionItem {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  company?: string;
}

export type TestimonialSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  testimonials: TestimonialSectionItem[];
  variant?: "grid" | "featured";
  columns?: 2 | 3;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

const TestimonialSection = forwardRef<HTMLElement, TestimonialSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      testimonials,
      variant = "grid",
      columns = 3,
      ...props
    },
    ref
  ) => {
    return (
      <Section
        ref={ref}
        data-slot="testimonial-section"
        eyebrow={eyebrow}
        title={title}
        description={description}
        className={className}
        {...props}
      >
        {variant === "grid" ? (
          <div className={cn("grid gap-6", columnClasses[columns])}>
            {testimonials.map((testimonial) => (
              <Testimonial
                key={testimonial.author}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                avatar={testimonial.avatar}
                company={testimonial.company}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Featured testimonial (first item) */}
            {testimonials.length > 0 && (
              <div className="bg-card-gradient rounded-xl border border-white/[0.06] p-8 flex flex-col justify-center">
                <span
                  aria-hidden="true"
                  className="mb-4 block select-none text-4xl leading-none text-white/70"
                >
                  &ldquo;
                </span>
                <blockquote className="text-lg italic leading-relaxed text-white/80 md:text-xl">
                  {testimonials[0].quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                    {testimonials[0].avatar && (
                      <img
                        src={testimonials[0].avatar}
                        alt={testimonials[0].author}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-medium text-white">
                      {testimonials[0].author}
                    </p>
                    <p className="text-sm text-white/70">
                      {testimonials[0].role}
                      {testimonials[0].company && (
                        <>, {testimonials[0].company}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Smaller testimonials (remaining items) */}
            {testimonials.length > 1 && (
              <div className="grid grid-cols-1 gap-6">
                {testimonials.slice(1).map((testimonial) => (
                  <Testimonial
                    key={testimonial.author}
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                    avatar={testimonial.avatar}
                    company={testimonial.company}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>
    );
  }
);

TestimonialSection.displayName = "TestimonialSection";

export { TestimonialSection };

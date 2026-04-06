import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type TestimonialProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  company?: string;
};

const Testimonial = forwardRef<HTMLDivElement, TestimonialProps>(
  ({ className, quote, author, role, avatar, company, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="testimonial"
      className={cn(
        "bg-card-gradient rounded-xl border border-border p-6",
        "shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu",
        className
      )}
      {...props}
    >
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="mb-3 block select-none text-2xl leading-none text-fg-200"
      >
        &ldquo;
      </span>

      <blockquote className="text-sm italic leading-relaxed text-fg-200">
        {quote}
      </blockquote>

      {/* Author */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-bg-subtle-hover">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-loud">{author}</p>
          <p className="text-xs text-fg-200">
            {role}
            {company && <>, {company}</>}
          </p>
        </div>
      </div>
    </div>
  )
);

Testimonial.displayName = "Testimonial";

export { Testimonial };

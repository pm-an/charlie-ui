import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type BlogCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  tag?: string;
  href?: string;
};

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, title, excerpt, date, image, tag, href, ...props }, ref) => {
    const cardClasses = cn(
      "group block overflow-hidden rounded-xl border border-white/[0.06] bg-card-gradient no-underline",
      className
    );

    const inner = (
      <>
        {/* Image area */}
        <div className="aspect-video w-full bg-grey-800">
          {image && (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {tag && (
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-red">
              {tag}
            </span>
          )}
          <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-red">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-white/60">{excerpt}</p>
          <time className="mt-3 block text-xs text-white/40">{date}</time>
        </div>
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          data-slot="blog-card"
          className={cardClasses}
        >
          {inner}
        </a>
      );
    }

    return (
      <div ref={ref} data-slot="blog-card" className={cardClasses} {...props}>
        {inner}
      </div>
    );
  }
);

BlogCard.displayName = "BlogCard";

export { BlogCard };

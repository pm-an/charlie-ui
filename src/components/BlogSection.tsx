import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { BlogCard } from "./BlogCard";
import { Section } from "./Section";
import { ArrowRight } from "lucide-react";

export interface BlogSectionPost {
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  tag?: string;
  href?: string;
}

export type BlogSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  posts: BlogSectionPost[];
  columns?: 2 | 3;
  viewAllHref?: string;
  viewAllLabel?: string;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

const BlogSection = forwardRef<HTMLElement, BlogSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      posts,
      columns = 3,
      viewAllHref,
      viewAllLabel = "View all posts",
      ...props
    },
    ref
  ) => {
    return (
      <Section
        ref={ref}
        data-slot="blog-section"
        eyebrow={eyebrow}
        title={title}
        description={description}
        className={className}
        {...props}
      >
        {viewAllHref && (
          <div className="mb-8 flex justify-end">
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red hover:underline"
            >
              {viewAllLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}

        <div className={cn("grid gap-6", columnClasses[columns])}>
          {posts.map((post) => (
            <BlogCard
              key={post.title}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              image={post.image}
              tag={post.tag}
              href={post.href}
            />
          ))}
        </div>
      </Section>
    );
  }
);

BlogSection.displayName = "BlogSection";

export { BlogSection };

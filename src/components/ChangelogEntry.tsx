import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type ChangelogEntryProps = HTMLAttributes<HTMLDivElement> & {
  date: string;
  version?: string;
  title: string;
  description?: string;
  tags?: string[];
  image?: string;
  children?: ReactNode;
};

function ChangelogEntry({
  className,
  date,
  version,
  title,
  description,
  tags,
  image,
  children,
  ...props
}: ChangelogEntryProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-4 md:gap-8", className)} {...props}>
      {/* Left column: date + timeline */}
      <div className="flex md:w-[120px] shrink-0 gap-3 items-center md:items-start">
        <span className="text-sm text-white/40">{date}</span>
        {version && (
          <span className="md:hidden inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
            {version}
          </span>
        )}
      </div>

      {/* Timeline dot + line */}
      <div className="hidden md:flex flex-col items-center">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white/20" />
        <span className="w-px flex-1 border-l border-white/[0.06]" />
      </div>

      {/* Right column: content */}
      <div className="flex-1 pb-8 md:pb-12 border-b md:border-b-0 border-white/[0.06] last:border-b-0">
        {version && (
          <span className="mb-2 hidden md:inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
            {version}
          </span>
        )}
        <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-white/60">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {image && (
          <img
            src={image}
            alt={title}
            className="mt-4 rounded-lg border border-white/[0.06]"
          />
        )}
        {children}
      </div>
    </div>
  );
}

ChangelogEntry.displayName = "ChangelogEntry";

export { ChangelogEntry };

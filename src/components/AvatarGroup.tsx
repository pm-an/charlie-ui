import { type ReactNode, type HTMLAttributes, Children } from "react";
import { cn } from "../utils/cn";

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  max?: number;
};

function AvatarGroup({ className, children, max, ...props }: AvatarGroupProps) {
  const childArray = Children.toArray(children);
  const visibleCount = max != null ? Math.min(max, childArray.length) : childArray.length;
  const overflowCount = childArray.length - visibleCount;

  return (
    <div
      data-slot="avatar-group"
      role="group"
      aria-label={`Group of ${childArray.length} avatars`}
      className={cn("flex -space-x-2", className)}
      {...props}
    >
      {childArray.slice(0, visibleCount).map((child, index) => (
        <span key={index} className="relative inline-flex ring-2 ring-bg rounded-full">
          {child}
        </span>
      ))}
      {overflowCount > 0 && (
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/60 ring-2 ring-bg">
          +{overflowCount}
        </span>
      )}
    </div>
  );
}

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };

import {
  forwardRef,
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../utils/cn";

/* --- Breadcrumbs.Item -------------------------------- */

export type BreadcrumbsItemProps = HTMLAttributes<HTMLElement> & {
  href?: string;
  active?: boolean;
  icon?: ReactNode;
};

const BreadcrumbsItem = forwardRef<HTMLElement, BreadcrumbsItemProps>(
  ({ className, href, active = false, icon, children, ...props }, ref) => {
    const content = (
      <>
        {icon && <span className="mr-1 inline-flex shrink-0">{icon}</span>}
        {children}
      </>
    );

    if (active || !href) {
      return (
        <li className="inline-flex items-center">
          <span
            ref={ref as React.Ref<HTMLSpanElement>}
            className={cn(
              active
                ? "text-white font-medium"
                : "text-white/70",
              "inline-flex items-center",
              className
            )}
            aria-current={active ? "page" : undefined}
            {...props}
          >
            {content}
          </span>
        </li>
      );
    }

    return (
      <li className="inline-flex items-center">
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            "text-white/70 hover:text-white transition-colors inline-flex items-center",
            className
          )}
          {...props}
        >
          {content}
        </a>
      </li>
    );
  }
);
BreadcrumbsItem.displayName = "Breadcrumbs.Item";

/* --- Breadcrumbs.Separator --------------------------- */

export type BreadcrumbsSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

const BreadcrumbsSeparator = forwardRef<HTMLSpanElement, BreadcrumbsSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li role="presentation" aria-hidden="true" className="inline-flex items-center">
        <span
          ref={ref}
          className={cn("text-white/70 mx-0.5", className)}
          {...props}
        >
          {children ?? <ChevronRight className="h-3.5 w-3.5" />}
        </span>
      </li>
    );
  }
);
BreadcrumbsSeparator.displayName = "Breadcrumbs.Separator";

/* --- Breadcrumbs Root -------------------------------- */

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  separator?: ReactNode;
  maxItems?: number;
};

const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, separator, maxItems, children, ...props }, ref) => {
    const childArray = Children.toArray(children).filter(isValidElement);

    const separatorNode = separator ?? <ChevronRight className="h-3.5 w-3.5" />;

    const renderSeparator = (key: string) => (
      <BreadcrumbsSeparator key={key}>{separatorNode}</BreadcrumbsSeparator>
    );

    let visibleItems: React.ReactNode[];

    if (maxItems && maxItems > 0 && childArray.length > maxItems) {
      // Show first item, ellipsis, last (maxItems - 1) items
      // (at minimum we always show 2 items when collapsing: first + last)
      const lastCount = Math.max(maxItems - 1, 1);
      const firstItems = [childArray[0]];
      const lastItems = childArray.slice(-lastCount);

      visibleItems = [];

      // First item
      visibleItems.push(firstItems[0]);
      visibleItems.push(renderSeparator("sep-first"));

      // Ellipsis
      visibleItems.push(
        <li key="ellipsis" className="inline-flex items-center">
          <span className="text-white/70 inline-flex items-center" role="presentation">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </span>
        </li>
      );
      visibleItems.push(renderSeparator("sep-ellipsis"));

      // Last items with separators between them
      lastItems.forEach((item, index) => {
        visibleItems.push(item);
        if (index < lastItems.length - 1) {
          visibleItems.push(renderSeparator(`sep-last-${index}`));
        }
      });
    } else {
      // Show all items with separators
      visibleItems = [];
      childArray.forEach((child, index) => {
        visibleItems.push(child);
        if (index < childArray.length - 1) {
          visibleItems.push(renderSeparator(`sep-${index}`));
        }
      });
    }

    return (
      <nav ref={ref} data-slot="breadcrumbs" aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center gap-1.5 text-sm">
          {visibleItems}
        </ol>
      </nav>
    );
  }
);
BreadcrumbsRoot.displayName = "Breadcrumbs";

/* --- Compound Export --------------------------------- */

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
  Separator: BreadcrumbsSeparator,
});

export { Breadcrumbs };

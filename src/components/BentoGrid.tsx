import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type BentoGridItemProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
  image?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  children?: ReactNode;
};

const BentoGridItem = forwardRef<HTMLDivElement, BentoGridItemProps>(
  (
    {
      className,
      title,
      description,
      icon,
      image,
      colSpan = 1,
      rowSpan = 1,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="bento-grid-item"
        className={cn(
          "bg-card-gradient rounded-xl border border-white/[0.06] p-6 overflow-hidden relative",
          colSpan === 2 && "md:col-span-2",
          rowSpan === 2 && "md:row-span-2",
          image && "p-0",
          className
        )}
        {...props}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={title || ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {(title || description) && (
              <div className="relative z-10 flex h-full flex-col justify-end p-6">
                {title && (
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-white/70">{description}</p>
                )}
              </div>
            )}
          </>
        ) : children ? (
          children
        ) : (
          <>
            {icon && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <span className="text-white/80">{icon}</span>
              </div>
            )}
            {title && (
              <h3 className="text-base font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                {description}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
);

BentoGridItem.displayName = "BentoGrid.Item";

export type BentoGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const BentoGridComponent = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="bento-grid"
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BentoGridComponent.displayName = "BentoGrid";

const BentoGrid = Object.assign(BentoGridComponent, {
  Item: BentoGridItem,
});

export { BentoGrid, BentoGridItem };

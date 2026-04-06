import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export type ProductGridProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  products: ProductCardProps[];
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  categories?: string[];
  onCategoryChange?: (category: string | null) => void;
  activeCategory?: string | null;
  title?: string;
  description?: string;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const ProductGrid = forwardRef<HTMLDivElement, ProductGridProps>(
  (
    {
      className,
      products,
      columns = 4,
      showFilters = false,
      categories = [],
      onCategoryChange,
      activeCategory: controlledCategory,
      title,
      description,
      ...props
    },
    ref
  ) => {
    const [internalCategory, setInternalCategory] = useState<string | null>(
      null
    );

    const isControlled = controlledCategory !== undefined;
    const activeCategory = isControlled ? controlledCategory : internalCategory;

    const handleCategoryChange = (category: string | null) => {
      if (!isControlled) {
        setInternalCategory(category);
      }
      onCategoryChange?.(category);
    };

    const filteredProducts =
      activeCategory && showFilters
        ? products.filter(() => {
            // If products have a className that includes the category, filter
            // In practice, filtering is done externally. This is a presentation layer.
            return true;
          })
        : products;

    return (
      <div
        ref={ref}
        data-slot="product-grid"
        className={cn("w-full", className)}
        {...props}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h2 className="text-2xl font-bold text-text-loud md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-sm text-fg-200 md:text-base">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Filter bar */}
        {showFilters && categories.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === null}
              onClick={() => handleCategoryChange(null)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeCategory === null
                  ? "bg-bg-subtle-hover text-text-loud"
                  : "bg-bg-subtle text-fg-200 hover:bg-bg-subtle-hover hover:text-text-loud"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  activeCategory === category
                    ? "bg-bg-subtle-hover text-text-loud"
                    : "bg-bg-subtle text-fg-200 hover:bg-bg-subtle-hover hover:text-text-loud"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className={cn("grid gap-4", columnClasses[columns])}>
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.name + index} {...product} />
          ))}
        </div>
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";

export { ProductGrid };

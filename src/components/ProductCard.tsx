import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Star, Eye, ShoppingCart } from "lucide-react";

export type ProductCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  onAddToCart?: () => void;
  onQuickView?: () => void;
  href?: string;
  currency?: string;
};

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      name,
      price,
      originalPrice,
      image,
      rating,
      reviewCount,
      badge,
      inStock = true,
      onAddToCart,
      onQuickView,
      href,
      currency = "$",
      ...props
    },
    ref
  ) => {
    const formattedPrice = `${currency}${price.toFixed(2)}`;
    const formattedOriginalPrice = originalPrice
      ? `${currency}${originalPrice.toFixed(2)}`
      : null;

    const renderStars = (value: number) => {
      return Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.round(value)
              ? "fill-yellow text-yellow"
              : "fill-transparent text-fg-200"
          )}
        />
      ));
    };

    const imageContent = (
      <div className="relative aspect-square bg-bg-subtle">
        {image && (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}

        {badge && (
          <span className="absolute top-2 left-2 rounded-md bg-accent-dim px-2 py-0.5 text-xs font-medium text-fg-on-accent">
            {badge}
          </span>
        )}

        {onQuickView && inStock && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute inset-0 flex items-center justify-center bg-overlay opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5 text-text-loud" />
          </button>
        )}

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay">
            <span className="text-sm font-medium text-text-loud">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    );

    const cardContent = (
      <>
        {imageContent}

        <div className="p-4">
          <h3 className="text-sm font-medium text-text-loud line-clamp-1">
            {name}
          </h3>

          {rating !== undefined && (
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {renderStars(rating)}
              </div>
              {reviewCount !== undefined && (
                <span className="text-xs text-fg-200">({reviewCount})</span>
              )}
            </div>
          )}

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-loud">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-sm text-fg-200 line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              disabled={!inStock}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                inStock
                  ? "bg-white/80 hover:bg-white text-[#18191a]"
                  : "bg-bg-subtle text-fg-200 cursor-not-allowed active:scale-100"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
        </div>
      </>
    );

    const cardClasses = cn(
      "group overflow-hidden rounded-xl border border-border bg-card-gradient",
      className
    );

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          data-slot="product-card"
          className={cn(cardClasses, "block no-underline")}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="product-card"
        className={cardClasses}
        {...props}
      >
        {cardContent}
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };

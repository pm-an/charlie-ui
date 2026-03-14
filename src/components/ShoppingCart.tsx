import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export type ShoppingCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
};

export type ShoppingCartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  items: ShoppingCartItem[];
  currency?: string;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
  shipping?: number;
  tax?: number;
};

const ShoppingCart = forwardRef<HTMLDivElement, ShoppingCartProps>(
  (
    {
      className,
      items,
      currency = "$",
      onUpdateQuantity,
      onRemoveItem,
      onCheckout,
      shipping,
      tax,
      ...props
    },
    ref
  ) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + (shipping ?? 0) + (tax ?? 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const formatPrice = (value: number) => `${currency}${value.toFixed(2)}`;

    return (
      <div
        ref={ref}
        data-slot="shopping-cart"
        className={cn(
          "overflow-hidden rounded-xl border border-white/[0.06] bg-card-gradient",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
          <span className="text-sm text-white/70">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <ShoppingBag className="h-10 w-10 text-white/70" />
            <p className="mt-3 text-sm text-white/70">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4"
                >
                  {/* Image */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-white/70">{item.variant}</p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity?.(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity?.(item.id, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <span className="shrink-0 text-sm font-medium text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  {/* Remove */}
                  {onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="shrink-0 text-white/70 transition-colors hover:text-white"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="px-6 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>

              {shipping !== undefined && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-white/70">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              )}

              {tax !== undefined && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-white/70">Tax</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
              )}

              <div className="my-4 border-t border-white/[0.06]" />

              <div className="flex justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-lg font-semibold text-white">
                  {formatPrice(total)}
                </span>
              </div>

              {onCheckout && (
                <button
                  type="button"
                  onClick={onCheckout}
                  className="mt-4 w-full rounded-md bg-white/80 px-4 py-2.5 text-sm font-medium text-[#18191a] transition-all duration-200 hover:bg-white active:scale-[0.98]"
                >
                  Checkout
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

ShoppingCart.displayName = "ShoppingCart";

export { ShoppingCart };

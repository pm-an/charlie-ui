import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export type OrderSummaryItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type OrderSummaryAddress = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type OrderSummaryProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderSummaryItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency?: string;
  shippingAddress?: OrderSummaryAddress;
};

const statusConfig: Record<
  OrderStatus,
  { icon: typeof CheckCircle; label: string; colorClass: string }
> = {
  confirmed: {
    icon: CheckCircle,
    label: "Order Confirmed",
    colorClass: "text-green",
  },
  processing: {
    icon: Clock,
    label: "Processing",
    colorClass: "text-yellow",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    colorClass: "text-blue",
  },
  delivered: {
    icon: Package,
    label: "Delivered",
    colorClass: "text-green",
  },
};

const OrderSummary = forwardRef<HTMLDivElement, OrderSummaryProps>(
  (
    {
      className,
      orderNumber,
      date,
      status,
      items,
      subtotal,
      shipping,
      tax,
      total,
      currency = "$",
      shippingAddress,
      ...props
    },
    ref
  ) => {
    const formatPrice = (value: number) => `${currency}${value.toFixed(2)}`;
    const { icon: StatusIcon, label: statusLabel, colorClass } =
      statusConfig[status];

    return (
      <div
        ref={ref}
        data-slot="order-summary"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card-gradient",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-5 w-5", colorClass)} />
            <h2 className="text-lg font-semibold text-text-loud">{statusLabel}</h2>
          </div>
          <p className="mt-1 text-sm text-fg-200">
            Order #{orderNumber}
          </p>
          <p className="text-sm text-fg-200">{date}</p>
        </div>

        {/* Items */}
        <div className="px-6 py-4">
          {items.map((item, index) => (
            <div
              key={item.name + index}
              className="flex items-center gap-3 py-2"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg-subtle">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-loud truncate">
                  {item.name}
                </p>
                <p className="text-xs text-fg-200">Qty: {item.quantity}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-text-loud">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex justify-between text-sm">
            <span className="text-fg-200">Subtotal</span>
            <span className="text-text-loud">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-fg-200">Shipping</span>
            <span className="text-text-loud">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-fg-200">Tax</span>
            <span className="text-text-loud">{formatPrice(tax)}</span>
          </div>
          <div className="my-3 border-t border-border" />
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-text-loud">Total</span>
            <span className="text-lg font-semibold text-text-loud">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div className="border-t border-border px-6 py-4">
            <h3 className="text-sm font-medium text-fg-200 mb-2">
              Shipping Address
            </h3>
            <div className="text-sm text-text-loud">
              <p>{shippingAddress.name}</p>
              <p className="text-fg-200">{shippingAddress.address}</p>
              <p className="text-fg-200">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zip}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OrderSummary.displayName = "OrderSummary";

export { OrderSummary };

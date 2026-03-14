import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderSummary, type OrderSummaryItem } from "./OrderSummary";

const sampleItems: OrderSummaryItem[] = [
  {
    name: "Wireless Headphones",
    quantity: 1,
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
  {
    name: "USB-C Hub Adapter",
    quantity: 2,
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625723186482-2232bd7b1094?w=200&h=200&fit=crop",
  },
];

const meta: Meta<typeof OrderSummary> = {
  title: "Blocks/Ecommerce/OrderSummary",
  component: OrderSummary,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof OrderSummary>;

export const Confirmed: Story = {
  args: {
    orderNumber: "ORD-2026-1847",
    date: "March 14, 2026",
    status: "confirmed",
    items: sampleItems,
    subtotal: 149.97,
    shipping: 9.99,
    tax: 12.0,
    total: 171.96,
  },
};

export const Processing: Story = {
  args: {
    orderNumber: "ORD-2026-1832",
    date: "March 13, 2026",
    status: "processing",
    items: sampleItems,
    subtotal: 149.97,
    shipping: 0,
    tax: 12.0,
    total: 161.97,
  },
};

export const Shipped: Story = {
  args: {
    orderNumber: "ORD-2026-1790",
    date: "March 10, 2026",
    status: "shipped",
    items: sampleItems,
    subtotal: 149.97,
    shipping: 5.99,
    tax: 12.0,
    total: 167.96,
  },
};

export const Delivered: Story = {
  args: {
    orderNumber: "ORD-2026-1654",
    date: "March 5, 2026",
    status: "delivered",
    items: [sampleItems[0]],
    subtotal: 79.99,
    shipping: 0,
    tax: 6.4,
    total: 86.39,
  },
};

export const WithShippingAddress: Story = {
  args: {
    orderNumber: "ORD-2026-1847",
    date: "March 14, 2026",
    status: "confirmed",
    items: sampleItems,
    subtotal: 149.97,
    shipping: 9.99,
    tax: 12.0,
    total: 171.96,
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
  },
};

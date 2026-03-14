import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./ProductCard";
import { fn } from "@storybook/test";

const meta: Meta<typeof ProductCard> = {
  title: "Blocks/Ecommerce/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: {
    onAddToCart: fn(),
    onQuickView: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
};

export const OnSale: Story = {
  args: {
    name: "Premium Bluetooth Speaker",
    price: 49.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    badge: "Sale",
  },
};

export const WithBadge: Story = {
  args: {
    name: "Smart Watch Series 5",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    badge: "New",
  },
};

export const OutOfStock: Story = {
  args: {
    name: "Limited Edition Sneakers",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    inStock: false,
  },
};

export const WithRating: Story = {
  args: {
    name: "Mechanical Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 128,
  },
};

export const NoImage: Story = {
  args: {
    name: "USB-C Charging Cable",
    price: 12.99,
    rating: 3,
    reviewCount: 42,
  },
};

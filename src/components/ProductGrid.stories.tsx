import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductGrid } from "./ProductGrid";
import type { ProductCardProps } from "./ProductCard";
import { fn } from "@storybook/test";

const sampleProducts: ProductCardProps[] = [
  {
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 128,
    onAddToCart: fn(),
  },
  {
    name: "Smart Watch Series 5",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    badge: "New",
    rating: 4.8,
    reviewCount: 256,
    onAddToCart: fn(),
  },
  {
    name: "Premium Bluetooth Speaker",
    price: 49.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    badge: "Sale",
    rating: 4.2,
    reviewCount: 87,
    onAddToCart: fn(),
  },
  {
    name: "Mechanical Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 312,
    onAddToCart: fn(),
  },
  {
    name: "USB-C Hub Adapter",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625723186482-2232bd7b1094?w=400&h=400&fit=crop",
    rating: 4.0,
    reviewCount: 64,
    onAddToCart: fn(),
  },
  {
    name: "Noise Cancelling Earbuds",
    price: 129.99,
    originalPrice: 169.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    badge: "Sale",
    rating: 4.6,
    reviewCount: 203,
    onAddToCart: fn(),
  },
  {
    name: "Laptop Stand",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 95,
    onAddToCart: fn(),
  },
  {
    name: "Wireless Mouse",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.1,
    reviewCount: 178,
    onAddToCart: fn(),
  },
];

const meta: Meta<typeof ProductGrid> = {
  title: "Blocks/Ecommerce/ProductGrid",
  component: ProductGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ProductGrid>;

export const Default: Story = {
  args: {
    products: sampleProducts,
    title: "Featured Products",
    description: "Discover our most popular tech accessories and gadgets.",
  },
};

export const WithFilters: Story = {
  render: () => {
    const [active, setActive] = useState<string | null>(null);
    return (
      <ProductGrid
        products={sampleProducts}
        title="Shop by Category"
        description="Browse products across all categories."
        showFilters
        categories={["Audio", "Wearables", "Accessories"]}
        activeCategory={active}
        onCategoryChange={setActive}
      />
    );
  },
};

export const TwoColumns: Story = {
  args: {
    products: sampleProducts.slice(0, 4),
    columns: 2,
    title: "Top Picks",
  },
};

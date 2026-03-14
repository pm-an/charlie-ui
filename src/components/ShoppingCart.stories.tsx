import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingCart, type ShoppingCartItem } from "./ShoppingCart";

const sampleItems: ShoppingCartItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    variant: "Matte Black",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 149.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop",
    variant: "Cherry MX Brown",
  },
  {
    id: "3",
    name: "USB-C Hub Adapter",
    price: 34.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1625723186482-2232bd7b1094?w=200&h=200&fit=crop",
  },
];

const meta: Meta<typeof ShoppingCart> = {
  title: "Blocks/Ecommerce/ShoppingCart",
  component: ShoppingCart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg mx-auto p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ShoppingCart>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(sampleItems);

    const handleUpdateQuantity = (id: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    };

    const handleRemoveItem = (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
      <ShoppingCart
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => alert("Proceeding to checkout!")}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const WithShippingAndTax: Story = {
  render: () => {
    const [items, setItems] = useState(sampleItems);

    const handleUpdateQuantity = (id: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    };

    const handleRemoveItem = (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
      <ShoppingCart
        items={items}
        shipping={9.99}
        tax={24.5}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => alert("Proceeding to checkout!")}
      />
    );
  },
};

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ShoppingCart, type ShoppingCartItem } from "../ShoppingCart";

const mockItems: ShoppingCartItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    quantity: 1,
    variant: "Matte Black",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 149.99,
    quantity: 2,
  },
];

describe("ShoppingCart", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ShoppingCart items={mockItems} className="my-cart" />
      );
      expect(container.firstChild).toHaveClass("my-cart");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ShoppingCart ref={ref} items={mockItems} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<ShoppingCart items={mockItems} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "shopping-cart"
      );
    });

    it("displays item count in header", () => {
      render(<ShoppingCart items={mockItems} />);
      // 1 + 2 = 3 items
      expect(screen.getByText("3 items")).toBeInTheDocument();
    });

    it("displays singular item when count is 1", () => {
      render(
        <ShoppingCart items={[{ id: "1", name: "A", price: 10, quantity: 1 }]} />
      );
      expect(screen.getByText("1 item")).toBeInTheDocument();
    });
  });

  describe("items", () => {
    it("renders each item name", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
      expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    });

    it("renders item variant when provided", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(screen.getByText("Matte Black")).toBeInTheDocument();
    });

    it("renders item image when provided", () => {
      const items: ShoppingCartItem[] = [
        {
          id: "1",
          name: "Product",
          price: 10,
          quantity: 1,
          image: "https://example.com/img.jpg",
        },
      ];
      render(<ShoppingCart items={items} />);
      const img = screen.getByAltText("Product");
      expect(img).toHaveAttribute("src", "https://example.com/img.jpg");
    });

    it("displays item quantity", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(screen.getByText("2")).toBeInTheDocument(); // quantity of keyboard
    });

    it("displays item line total (price * quantity)", () => {
      render(<ShoppingCart items={mockItems} />);
      // Keyboard: 149.99 * 2 = 299.98
      expect(screen.getByText("$299.98")).toBeInTheDocument();
    });
  });

  describe("totals", () => {
    it("calculates and displays subtotal", () => {
      render(<ShoppingCart items={mockItems} />);
      // 79.99 * 1 + 149.99 * 2 = 379.97
      // Both subtotal and total show $379.97 (no shipping/tax)
      const matches = screen.getAllByText("$379.97");
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it("displays shipping when provided", () => {
      render(<ShoppingCart items={mockItems} shipping={9.99} />);
      expect(screen.getByText("Shipping")).toBeInTheDocument();
      expect(screen.getByText("$9.99")).toBeInTheDocument();
    });

    it("displays free shipping when shipping is 0", () => {
      render(<ShoppingCart items={mockItems} shipping={0} />);
      expect(screen.getByText("Free")).toBeInTheDocument();
    });

    it("displays tax when provided", () => {
      render(<ShoppingCart items={mockItems} tax={25.0} />);
      expect(screen.getByText("Tax")).toBeInTheDocument();
      expect(screen.getByText("$25.00")).toBeInTheDocument();
    });

    it("calculates total with shipping and tax", () => {
      render(
        <ShoppingCart items={mockItems} shipping={9.99} tax={25.0} />
      );
      // subtotal 379.97 + 9.99 + 25.00 = 414.96
      expect(screen.getByText("$414.96")).toBeInTheDocument();
    });

    it("uses custom currency", () => {
      render(
        <ShoppingCart
          items={[{ id: "1", name: "A", price: 10, quantity: 1 }]}
          currency="EUR "
        />
      );
      // Line total, subtotal, and total all show EUR 10.00
      const matches = screen.getAllByText("EUR 10.00");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("empty state", () => {
    it("renders empty state when items is empty", () => {
      render(<ShoppingCart items={[]} />);
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });

    it("shows 0 items in header when empty", () => {
      render(<ShoppingCart items={[]} />);
      expect(screen.getByText("0 items")).toBeInTheDocument();
    });

    it("does not render checkout button when empty", () => {
      const onCheckout = vi.fn();
      render(<ShoppingCart items={[]} onCheckout={onCheckout} />);
      expect(
        screen.queryByRole("button", { name: /checkout/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onUpdateQuantity with incremented value when plus is clicked", () => {
      const onUpdateQuantity = vi.fn();
      render(
        <ShoppingCart items={mockItems} onUpdateQuantity={onUpdateQuantity} />
      );
      const plusButtons = screen.getAllByLabelText(/increase quantity/i);
      fireEvent.click(plusButtons[0]);
      expect(onUpdateQuantity).toHaveBeenCalledWith("1", 2);
    });

    it("calls onUpdateQuantity with decremented value when minus is clicked", () => {
      const onUpdateQuantity = vi.fn();
      render(
        <ShoppingCart items={mockItems} onUpdateQuantity={onUpdateQuantity} />
      );
      const minusButtons = screen.getAllByLabelText(/decrease quantity/i);
      fireEvent.click(minusButtons[1]); // keyboard, quantity 2
      expect(onUpdateQuantity).toHaveBeenCalledWith("2", 1);
    });

    it("does not go below 1 when minus is clicked", () => {
      const onUpdateQuantity = vi.fn();
      render(
        <ShoppingCart items={mockItems} onUpdateQuantity={onUpdateQuantity} />
      );
      const minusButtons = screen.getAllByLabelText(/decrease quantity/i);
      fireEvent.click(minusButtons[0]); // headphones, quantity 1
      expect(onUpdateQuantity).toHaveBeenCalledWith("1", 1);
    });

    it("calls onRemoveItem when remove button is clicked", () => {
      const onRemoveItem = vi.fn();
      render(
        <ShoppingCart items={mockItems} onRemoveItem={onRemoveItem} />
      );
      const removeButtons = screen.getAllByLabelText(/remove/i);
      fireEvent.click(removeButtons[0]);
      expect(onRemoveItem).toHaveBeenCalledWith("1");
    });

    it("does not render remove buttons when onRemoveItem is not provided", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(screen.queryByLabelText(/remove/i)).not.toBeInTheDocument();
    });

    it("calls onCheckout when checkout button is clicked", () => {
      const onCheckout = vi.fn();
      render(
        <ShoppingCart items={mockItems} onCheckout={onCheckout} />
      );
      fireEvent.click(screen.getByRole("button", { name: /checkout/i }));
      expect(onCheckout).toHaveBeenCalledTimes(1);
    });

    it("does not render checkout button when onCheckout is not provided", () => {
      render(<ShoppingCart items={mockItems} />);
      expect(
        screen.queryByRole("button", { name: /checkout/i })
      ).not.toBeInTheDocument();
    });
  });
});

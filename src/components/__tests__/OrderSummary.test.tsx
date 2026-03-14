import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OrderSummary, type OrderSummaryItem } from "../OrderSummary";

const mockItems: OrderSummaryItem[] = [
  { name: "Wireless Headphones", quantity: 1, price: 79.99 },
  { name: "USB-C Hub", quantity: 2, price: 34.99 },
];

const defaultProps = {
  orderNumber: "ORD-001",
  date: "March 14, 2026",
  status: "confirmed" as const,
  items: mockItems,
  subtotal: 149.97,
  shipping: 9.99,
  tax: 12.0,
  total: 171.96,
};

describe("OrderSummary", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("Order Confirmed")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <OrderSummary {...defaultProps} className="my-order" />
      );
      expect(container.firstChild).toHaveClass("my-order");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<OrderSummary ref={ref} {...defaultProps} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<OrderSummary {...defaultProps} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "order-summary"
      );
    });

    it("spreads additional HTML attributes", () => {
      render(<OrderSummary {...defaultProps} data-testid="my-order" />);
      expect(screen.getByTestId("my-order")).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("displays order number", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("Order #ORD-001")).toBeInTheDocument();
    });

    it("displays date", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("March 14, 2026")).toBeInTheDocument();
    });
  });

  describe("status", () => {
    it("shows correct label for confirmed", () => {
      render(<OrderSummary {...defaultProps} status="confirmed" />);
      expect(screen.getByText("Order Confirmed")).toBeInTheDocument();
    });

    it("shows correct label for processing", () => {
      render(<OrderSummary {...defaultProps} status="processing" />);
      expect(screen.getByText("Processing")).toBeInTheDocument();
    });

    it("shows correct label for shipped", () => {
      render(<OrderSummary {...defaultProps} status="shipped" />);
      expect(screen.getByText("Shipped")).toBeInTheDocument();
    });

    it("shows correct label for delivered", () => {
      render(<OrderSummary {...defaultProps} status="delivered" />);
      expect(screen.getByText("Delivered")).toBeInTheDocument();
    });

    it("renders status icon with correct color class", () => {
      const { container } = render(
        <OrderSummary {...defaultProps} status="processing" />
      );
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-yellow");
    });

    it("renders shipped status icon with blue color", () => {
      const { container } = render(
        <OrderSummary {...defaultProps} status="shipped" />
      );
      const icon = container.querySelector("svg");
      expect(icon).toHaveClass("text-blue");
    });
  });

  describe("items", () => {
    it("renders each item name", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
      expect(screen.getByText("USB-C Hub")).toBeInTheDocument();
    });

    it("renders item quantities", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("Qty: 1")).toBeInTheDocument();
      expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    });

    it("renders item line totals", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("$79.99")).toBeInTheDocument();
      expect(screen.getByText("$69.98")).toBeInTheDocument(); // 34.99 * 2
    });

    it("renders item images when provided", () => {
      const items: OrderSummaryItem[] = [
        {
          name: "Product",
          quantity: 1,
          price: 10,
          image: "https://example.com/img.jpg",
        },
      ];
      render(<OrderSummary {...defaultProps} items={items} />);
      const img = screen.getByAltText("Product");
      expect(img).toHaveAttribute("src", "https://example.com/img.jpg");
    });

    it("renders without images when not provided", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("totals", () => {
    it("displays subtotal", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("$149.97")).toBeInTheDocument();
    });

    it("displays shipping cost", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("$9.99")).toBeInTheDocument();
    });

    it("displays free when shipping is 0", () => {
      render(<OrderSummary {...defaultProps} shipping={0} />);
      expect(screen.getByText("Free")).toBeInTheDocument();
    });

    it("displays tax", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("$12.00")).toBeInTheDocument();
    });

    it("displays total", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.getByText("$171.96")).toBeInTheDocument();
    });

    it("uses custom currency", () => {
      render(<OrderSummary {...defaultProps} currency="EUR " />);
      expect(screen.getByText("EUR 171.96")).toBeInTheDocument();
    });
  });

  describe("shipping address", () => {
    it("renders shipping address when provided", () => {
      render(
        <OrderSummary
          {...defaultProps}
          shippingAddress={{
            name: "John Doe",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
          }}
        />
      );
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
    });

    it("does not render shipping address section when not provided", () => {
      render(<OrderSummary {...defaultProps} />);
      expect(screen.queryByText("Shipping Address")).not.toBeInTheDocument();
    });
  });
});

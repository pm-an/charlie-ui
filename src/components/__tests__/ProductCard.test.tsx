import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductCard } from "../ProductCard";

describe("ProductCard", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ProductCard name="Test Product" price={29.99} />);
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    it("renders the formatted price", () => {
      render(<ProductCard name="Widget" price={49.99} />);
      expect(screen.getByText("$49.99")).toBeInTheDocument();
    });

    it("renders with custom currency", () => {
      render(<ProductCard name="Widget" price={29.99} currency="EUR " />);
      expect(screen.getByText("EUR 29.99")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ProductCard name="Test" price={10} className="my-custom" />
      );
      expect(container.firstChild).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ProductCard ref={ref} name="Test" price={10} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <ProductCard name="Test" price={10} />
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "product-card");
    });

    it("spreads additional HTML attributes", () => {
      render(
        <ProductCard name="Test" price={10} data-testid="my-card" />
      );
      expect(screen.getByTestId("my-card")).toBeInTheDocument();
    });
  });

  describe("image", () => {
    it("renders image when provided", () => {
      render(
        <ProductCard name="Test" price={10} image="https://example.com/img.jpg" />
      );
      const img = screen.getByAltText("Test");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/img.jpg");
    });

    it("renders without image when not provided", () => {
      render(<ProductCard name="Test" price={10} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("badge", () => {
    it("renders badge when provided", () => {
      render(<ProductCard name="Test" price={10} badge="Sale" />);
      expect(screen.getByText("Sale")).toBeInTheDocument();
    });

    it("does not render badge when not provided", () => {
      render(<ProductCard name="Test" price={10} />);
      expect(screen.queryByText("Sale")).not.toBeInTheDocument();
    });
  });

  describe("sale price", () => {
    it("shows original price with line-through when on sale", () => {
      render(
        <ProductCard name="Test" price={49.99} originalPrice={89.99} />
      );
      expect(screen.getByText("$49.99")).toBeInTheDocument();
      const original = screen.getByText("$89.99");
      expect(original).toBeInTheDocument();
      expect(original).toHaveClass("line-through");
    });

    it("does not show original price when not on sale", () => {
      render(<ProductCard name="Test" price={49.99} />);
      expect(screen.queryByText("line-through")).not.toBeInTheDocument();
    });
  });

  describe("rating", () => {
    it("renders stars when rating is provided", () => {
      const { container } = render(
        <ProductCard name="Test" price={10} rating={4} reviewCount={50} />
      );
      const stars = container.querySelectorAll("svg");
      expect(stars.length).toBeGreaterThanOrEqual(5);
      expect(screen.getByText("(50)")).toBeInTheDocument();
    });

    it("does not render stars when rating is not provided", () => {
      render(<ProductCard name="Test" price={10} />);
      expect(screen.queryByText("(")).not.toBeInTheDocument();
    });
  });

  describe("stock status", () => {
    it("shows out of stock overlay when inStock is false", () => {
      render(<ProductCard name="Test" price={10} inStock={false} />);
      expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    });

    it("disables add to cart button when out of stock", () => {
      const onAddToCart = vi.fn();
      render(
        <ProductCard
          name="Test"
          price={10}
          inStock={false}
          onAddToCart={onAddToCart}
        />
      );
      const button = screen.getByRole("button", { name: /out of stock/i });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(onAddToCart).not.toHaveBeenCalled();
    });
  });

  describe("interactions", () => {
    it("calls onAddToCart when add to cart button is clicked", () => {
      const onAddToCart = vi.fn();
      render(
        <ProductCard name="Test" price={10} onAddToCart={onAddToCart} />
      );
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
      expect(onAddToCart).toHaveBeenCalledTimes(1);
    });

    it("calls onQuickView when quick view button is clicked", () => {
      const onQuickView = vi.fn();
      render(
        <ProductCard name="Test" price={10} onQuickView={onQuickView} />
      );
      fireEvent.click(screen.getByLabelText("Quick view"));
      expect(onQuickView).toHaveBeenCalledTimes(1);
    });

    it("does not show quick view button when out of stock", () => {
      const onQuickView = vi.fn();
      render(
        <ProductCard
          name="Test"
          price={10}
          inStock={false}
          onQuickView={onQuickView}
        />
      );
      expect(screen.queryByLabelText("Quick view")).not.toBeInTheDocument();
    });

    it("does not render add to cart button when onAddToCart is not provided", () => {
      render(<ProductCard name="Test" price={10} />);
      expect(
        screen.queryByRole("button", { name: /add to cart/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("link behavior", () => {
    it("renders as anchor when href is provided", () => {
      const { container } = render(
        <ProductCard name="Test" price={10} href="/products/1" />
      );
      const link = container.firstChild as HTMLElement;
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/products/1");
    });

    it("renders as div when href is not provided", () => {
      const { container } = render(
        <ProductCard name="Test" price={10} />
      );
      expect((container.firstChild as HTMLElement).tagName).toBe("DIV");
    });
  });
});

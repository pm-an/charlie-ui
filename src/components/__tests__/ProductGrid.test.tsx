import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductGrid } from "../ProductGrid";
import type { ProductCardProps } from "../ProductCard";

const mockProducts: ProductCardProps[] = [
  { name: "Product A", price: 29.99 },
  { name: "Product B", price: 49.99 },
  { name: "Product C", price: 19.99 },
];

describe("ProductGrid", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ProductGrid products={mockProducts} />);
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
      expect(screen.getByText("Product C")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} className="my-grid" />
      );
      expect(container.firstChild).toHaveClass("my-grid");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ProductGrid ref={ref} products={mockProducts} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} />
      );
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "product-grid"
      );
    });

    it("renders all products", () => {
      render(<ProductGrid products={mockProducts} />);
      const cards = screen.getAllByText(/Product [A-C]/);
      expect(cards).toHaveLength(3);
    });
  });

  describe("header", () => {
    it("renders title when provided", () => {
      render(
        <ProductGrid products={mockProducts} title="Featured Products" />
      );
      expect(screen.getByText("Featured Products")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <ProductGrid
          products={mockProducts}
          description="Browse our collection"
        />
      );
      expect(screen.getByText("Browse our collection")).toBeInTheDocument();
    });

    it("does not render header when title and description are absent", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} />
      );
      expect(container.querySelector("h2")).not.toBeInTheDocument();
    });
  });

  describe("columns", () => {
    it("defaults to 4 columns", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });

    it("renders 2 columns when specified", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} columns={2} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
      expect(grid).not.toHaveClass("lg:grid-cols-4");
    });

    it("renders 3 columns when specified", () => {
      const { container } = render(
        <ProductGrid products={mockProducts} columns={3} />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });
  });

  describe("filters", () => {
    it("does not render filters by default", () => {
      render(
        <ProductGrid
          products={mockProducts}
          categories={["Cat A", "Cat B"]}
        />
      );
      expect(screen.queryByText("All")).not.toBeInTheDocument();
    });

    it("renders filter tabs when showFilters is true", () => {
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics", "Audio"]}
        />
      );
      expect(screen.getByText("All")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("Audio")).toBeInTheDocument();
    });

    it("calls onCategoryChange when a filter is clicked", () => {
      const onCategoryChange = vi.fn();
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics"]}
          onCategoryChange={onCategoryChange}
        />
      );
      fireEvent.click(screen.getByText("Electronics"));
      expect(onCategoryChange).toHaveBeenCalledWith("Electronics");
    });

    it("calls onCategoryChange with null when All is clicked", () => {
      const onCategoryChange = vi.fn();
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics"]}
          activeCategory="Electronics"
          onCategoryChange={onCategoryChange}
        />
      );
      fireEvent.click(screen.getByText("All"));
      expect(onCategoryChange).toHaveBeenCalledWith(null);
    });

    it("highlights the active category", () => {
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics", "Audio"]}
          activeCategory="Audio"
        />
      );
      const audioTab = screen.getByText("Audio");
      expect(audioTab).toHaveClass("bg-bg-subtle-hover");
    });

    it("highlights All when no category is active", () => {
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics"]}
          activeCategory={null}
        />
      );
      const allTab = screen.getByText("All");
      expect(allTab).toHaveClass("bg-bg-subtle-hover");
    });

    it("uses aria-selected on filter tabs", () => {
      render(
        <ProductGrid
          products={mockProducts}
          showFilters
          categories={["Electronics"]}
          activeCategory="Electronics"
        />
      );
      expect(screen.getByText("Electronics")).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByText("All")).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });
  });

  describe("empty state", () => {
    it("renders an empty grid when products is empty", () => {
      const { container } = render(<ProductGrid products={[]} />);
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid?.children).toHaveLength(0);
    });
  });
});

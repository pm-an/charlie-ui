import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BentoGrid } from "../BentoGrid";

describe("BentoGrid", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(
        <BentoGrid data-testid="grid">
          <BentoGrid.Item title="Item 1" />
        </BentoGrid>
      );
      expect(screen.getByTestId("grid")).toBeInTheDocument();
    });

    it("renders children", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item title="First item" />
          <BentoGrid.Item title="Second item" />
        </BentoGrid>
      );
      expect(screen.getByText("First item")).toBeInTheDocument();
      expect(screen.getByText("Second item")).toBeInTheDocument();
    });

    it("applies custom className to grid", () => {
      render(
        <BentoGrid className="custom-grid" data-testid="grid">
          <BentoGrid.Item title="Item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("grid")).toHaveClass("custom-grid");
    });

    it("has data-slot attribute on grid", () => {
      render(
        <BentoGrid data-testid="grid">
          <BentoGrid.Item title="Item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("grid")).toHaveAttribute("data-slot", "bento-grid");
    });

    it("forwards ref on grid", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <BentoGrid ref={ref}>
          <BentoGrid.Item title="Item" />
        </BentoGrid>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has grid layout classes", () => {
      render(
        <BentoGrid data-testid="grid">
          <BentoGrid.Item title="Item" />
        </BentoGrid>
      );
      const grid = screen.getByTestId("grid");
      expect(grid).toHaveClass("grid");
      expect(grid).toHaveClass("gap-4");
    });
  });

  describe("BentoGrid.Item", () => {
    it("renders title and description", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item title="Test Title" description="Test Description" />
        </BentoGrid>
      );
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("renders icon when provided", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item
            title="With Icon"
            icon={<span data-testid="test-icon">I</span>}
          />
        </BentoGrid>
      );
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("does not render icon container when no icon", () => {
      const { container } = render(
        <BentoGrid>
          <BentoGrid.Item title="No Icon" />
        </BentoGrid>
      );
      expect(container.querySelector(".bg-white\\/5")).not.toBeInTheDocument();
    });

    it("renders image with overlay text", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item
            image="https://example.com/image.jpg"
            title="Image Title"
            description="Image Desc"
          />
        </BentoGrid>
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
      expect(screen.getByText("Image Title")).toBeInTheDocument();
      expect(screen.getByText("Image Desc")).toBeInTheDocument();
    });

    it("applies colSpan 2 class", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item colSpan={2} title="Wide" data-testid="wide-item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("wide-item")).toHaveClass("md:col-span-2");
    });

    it("applies rowSpan 2 class", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item rowSpan={2} title="Tall" data-testid="tall-item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("tall-item")).toHaveClass("md:row-span-2");
    });

    it("does not apply span classes when span is 1", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item colSpan={1} rowSpan={1} title="Normal" data-testid="normal-item" />
        </BentoGrid>
      );
      const item = screen.getByTestId("normal-item");
      expect(item).not.toHaveClass("md:col-span-2");
      expect(item).not.toHaveClass("md:row-span-2");
    });

    it("applies custom className to item", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item className="custom-item" title="Item" data-testid="item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("item")).toHaveClass("custom-item");
    });

    it("has data-slot attribute on item", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item title="Item" data-testid="item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("item")).toHaveAttribute("data-slot", "bento-grid-item");
    });

    it("forwards ref on item", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <BentoGrid>
          <BentoGrid.Item ref={ref} title="Item" />
        </BentoGrid>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders custom children instead of default content", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item>
            <div data-testid="custom-content">Custom content here</div>
          </BentoGrid.Item>
        </BentoGrid>
      );
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });

    it("renders without title or description", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item
            icon={<span data-testid="only-icon">I</span>}
            data-testid="icon-only"
          />
        </BentoGrid>
      );
      expect(screen.getByTestId("icon-only")).toBeInTheDocument();
      expect(screen.getByTestId("only-icon")).toBeInTheDocument();
    });

    it("spreads additional HTML attributes", () => {
      render(
        <BentoGrid>
          <BentoGrid.Item title="Item" aria-label="Grid item" data-testid="item" />
        </BentoGrid>
      );
      expect(screen.getByTestId("item")).toHaveAttribute("aria-label", "Grid item");
    });
  });
});

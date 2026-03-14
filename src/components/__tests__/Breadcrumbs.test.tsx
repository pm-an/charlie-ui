import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Breadcrumbs } from "../Breadcrumbs";

describe("Breadcrumbs", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Page")).toBeInTheDocument();
    });

    it("renders a single item", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item active>Dashboard</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("renders as a nav element", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders an ordered list", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("applies custom className to nav", () => {
      render(
        <Breadcrumbs className="custom-breadcrumbs">
          <Breadcrumbs.Item active>Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByRole("navigation")).toHaveClass("custom-breadcrumbs");
    });
  });

  describe("items", () => {
    it("renders link items as anchor tags", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const link = screen.getByText("Products").closest("a");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/products");
    });

    it("renders active items as spans (not links)", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item active>Current Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const element = screen.getByText("Current Page");
      expect(element.tagName).toBe("SPAN");
      expect(element.closest("a")).toBeNull();
    });

    it("renders items without href as spans", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Just Text</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const element = screen.getByText("Just Text");
      expect(element.tagName).toBe("SPAN");
    });

    it("renders active item with font-medium class", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item active>Active</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Active")).toHaveClass("font-medium");
    });

    it("applies custom className to items", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/" className="custom-item">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const link = screen.getByText("Home").closest("a");
      expect(link).toHaveClass("custom-item");
    });

    it("renders icon when provided", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/" icon={<span data-testid="home-icon">H</span>}>
            Home
          </Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    });
  });

  describe("separators", () => {
    it("auto-inserts separators between items", () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Details</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      // Should have 2 separator list items (between 3 items)
      const separators = container.querySelectorAll('li[aria-hidden="true"]');
      expect(separators).toHaveLength(2);
    });

    it("does not insert separator for a single item", () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item active>Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const separators = container.querySelectorAll('li[aria-hidden="true"]');
      expect(separators).toHaveLength(0);
    });

    it("renders custom separator", () => {
      render(
        <Breadcrumbs separator={<span data-testid="custom-sep">/</span>}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByTestId("custom-sep")).toBeInTheDocument();
    });
  });

  describe("maxItems (collapsing)", () => {
    it("collapses middle items when exceeding maxItems", () => {
      render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">A</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/b">B</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/c">C</Breadcrumbs.Item>
          <Breadcrumbs.Item active>D</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      // First and last 2 items should be visible
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("D")).toBeInTheDocument();
      // Middle items should be hidden
      expect(screen.queryByText("A")).not.toBeInTheDocument();
      expect(screen.queryByText("B")).not.toBeInTheDocument();
    });

    it("shows ellipsis when items are collapsed", () => {
      const { container } = render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">A</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/b">B</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/c">C</Breadcrumbs.Item>
          <Breadcrumbs.Item active>D</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      // Ellipsis element should exist (MoreHorizontal icon in a presentation span)
      const ellipsis = container.querySelector('[role="presentation"]:not([aria-hidden])');
      expect(ellipsis).toBeInTheDocument();
    });

    it("does not collapse when items count equals maxItems", () => {
      render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Details</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("does not collapse when items count is less than maxItems", () => {
      render(
        <Breadcrumbs maxItems={5}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Page")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has aria-label on nav", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item active>Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    });

    it("sets aria-current=page on active item", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
    });

    it("does not set aria-current on non-active items", () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const link = screen.getByText("Home").closest("a");
      expect(link).not.toHaveAttribute("aria-current");
    });

    it("marks separators as aria-hidden", () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item active>Page</Breadcrumbs.Item>
        </Breadcrumbs>
      );
      const hiddenElements = container.querySelectorAll('li[aria-hidden="true"]');
      expect(hiddenElements.length).toBeGreaterThan(0);
    });
  });

  describe("compound component", () => {
    it("exposes Item sub-component", () => {
      expect(Breadcrumbs.Item).toBeDefined();
    });

    it("exposes Separator sub-component", () => {
      expect(Breadcrumbs.Separator).toBeDefined();
    });

    it("has correct displayName", () => {
      expect(Breadcrumbs.displayName).toBe("Breadcrumbs");
    });

    it("Item has correct displayName", () => {
      expect(Breadcrumbs.Item.displayName).toBe("Breadcrumbs.Item");
    });

    it("Separator has correct displayName", () => {
      expect(Breadcrumbs.Separator.displayName).toBe("Breadcrumbs.Separator");
    });
  });
});

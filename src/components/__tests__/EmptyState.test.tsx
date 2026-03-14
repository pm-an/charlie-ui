import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<EmptyState title="No items" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toBeInTheDocument();
    });

    it("renders title", () => {
      render(<EmptyState title="Nothing here" />);
      expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(<EmptyState title="No items" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveAttribute("data-slot", "empty-state");
    });

    it("applies custom className", () => {
      render(<EmptyState title="Test" className="custom" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<EmptyState ref={ref} title="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("is centered with flex column", () => {
      render(<EmptyState title="Test" data-testid="empty" />);
      const el = screen.getByTestId("empty");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("flex-col");
      expect(el).toHaveClass("items-center");
      expect(el).toHaveClass("text-center");
    });

    it("spreads additional HTML attributes", () => {
      render(<EmptyState title="Test" aria-label="Empty" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveAttribute("aria-label", "Empty");
    });
  });

  describe("description", () => {
    it("renders description when provided", () => {
      render(
        <EmptyState title="No items" description="Start by adding items" />
      );
      expect(screen.getByText("Start by adding items")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const { container } = render(<EmptyState title="No items" />);
      const desc = container.querySelector(".text-white\\/40");
      expect(desc).not.toBeInTheDocument();
    });
  });

  describe("icon", () => {
    it("renders default Inbox icon when no icon provided", () => {
      const { container } = render(
        <EmptyState title="No items" data-testid="empty" />
      );
      // Default icon should be rendered (Inbox from Lucide)
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("renders custom icon when provided", () => {
      render(
        <EmptyState
          title="No items"
          icon={<span data-testid="custom-icon">Icon</span>}
        />
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("action", () => {
    it("renders action when provided", () => {
      render(
        <EmptyState
          title="No items"
          action={<button data-testid="action-btn">Add item</button>}
        />
      );
      expect(screen.getByTestId("action-btn")).toBeInTheDocument();
    });

    it("does not render action container when no action", () => {
      const { container } = render(<EmptyState title="No items" />);
      const actionContainer = container.querySelector(".mt-4:last-child");
      // There should be no action wrapper (mt-4 only from title)
      const buttons = container.querySelectorAll("button");
      expect(buttons).toHaveLength(0);
    });
  });

  describe("size variants", () => {
    it("renders sm size", () => {
      render(<EmptyState size="sm" title="Small" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-6");
    });

    it("renders md size (default)", () => {
      render(<EmptyState title="Medium" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-10");
    });

    it("renders lg size", () => {
      render(<EmptyState size="lg" title="Large" data-testid="empty" />);
      expect(screen.getByTestId("empty")).toHaveClass("py-16");
    });

    it("applies sm icon container padding", () => {
      const { container } = render(<EmptyState size="sm" title="Small" />);
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toHaveClass("p-3");
    });

    it("applies md icon container padding", () => {
      const { container } = render(<EmptyState size="md" title="Medium" />);
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toHaveClass("p-4");
    });

    it("applies lg icon container padding", () => {
      const { container } = render(<EmptyState size="lg" title="Large" />);
      const iconContainer = container.querySelector(".rounded-full");
      expect(iconContainer).toHaveClass("p-5");
    });

    it("applies sm title text size", () => {
      render(<EmptyState size="sm" title="Small Title" />);
      const title = screen.getByText("Small Title");
      expect(title).toHaveClass("text-sm");
    });

    it("applies md title text size", () => {
      render(<EmptyState size="md" title="Medium Title" />);
      const title = screen.getByText("Medium Title");
      expect(title).toHaveClass("text-base");
    });

    it("applies lg title text size", () => {
      render(<EmptyState size="lg" title="Large Title" />);
      const title = screen.getByText("Large Title");
      expect(title).toHaveClass("text-lg");
    });

    it("applies sm description text size", () => {
      render(
        <EmptyState size="sm" title="T" description="Small desc" />
      );
      expect(screen.getByText("Small desc")).toHaveClass("text-xs");
    });

    it("applies md description text size", () => {
      render(
        <EmptyState size="md" title="T" description="Medium desc" />
      );
      expect(screen.getByText("Medium desc")).toHaveClass("text-sm");
    });

    it("applies lg description text size", () => {
      render(
        <EmptyState size="lg" title="T" description="Large desc" />
      );
      expect(screen.getByText("Large desc")).toHaveClass("text-base");
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Pagination } from "../Pagination";
import { expectNoA11yViolations } from "../../test/a11y";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 5,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
    });

    it("renders as a nav element", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Pagination {...defaultProps} className="custom-pagination" />);
      expect(screen.getByRole("navigation")).toHaveClass("custom-pagination");
    });

    it("renders page buttons", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
    });

    it("renders first and last page buttons by default", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
    });

    it("renders prev and next buttons by default", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    });
  });

  describe("page range algorithm", () => {
    it("shows all pages when total is small", () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
      }
    });

    it("shows ellipsis on the right when near the start", () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
      );
      // Page 1 should be visible
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      // Page 10 should be visible
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      // Should have an ellipsis
      const ellipses = container.querySelectorAll('[role="presentation"]');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it("shows ellipsis on the left when near the end", () => {
      const { container } = render(
        <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />
      );
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      const ellipses = container.querySelectorAll('[role="presentation"]');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it("shows ellipsis on both sides when in the middle", () => {
      const { container } = render(
        <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
      );
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 10")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
      // Should have 2 ellipses
      const ellipses = container.querySelectorAll('[role="presentation"]');
      expect(ellipses.length).toBe(2);
    });

    it("respects siblingCount", () => {
      render(
        <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} siblingCount={2} />
      );
      // With siblingCount=2, pages 3,4,5,6,7 should be visible
      for (let i = 3; i <= 7; i++) {
        expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe("interactions", () => {
    it("calls onPageChange when a page is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByLabelText("Go to page 6"));
      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it("calls onPageChange with previous page when prev is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByLabelText("Go to previous page"));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange with next page when next is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByLabelText("Go to next page"));
      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it("calls onPageChange with 1 when first page button is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByLabelText("Go to first page"));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("calls onPageChange with totalPages when last page button is clicked", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByLabelText("Go to last page"));
      expect(onPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe("disabled states", () => {
    it("disables prev and first buttons on first page", () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to first page")).toBeDisabled();
      expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    });

    it("disables next and last buttons on last page", () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to next page")).toBeDisabled();
      expect(screen.getByLabelText("Go to last page")).toBeDisabled();
    });

    it("enables prev and first when not on first page", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to first page")).toBeEnabled();
      expect(screen.getByLabelText("Go to previous page")).toBeEnabled();
    });

    it("enables next and last when not on last page", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to next page")).toBeEnabled();
      expect(screen.getByLabelText("Go to last page")).toBeEnabled();
    });

    it("disables all buttons when disabled prop is true", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} disabled />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("does not call onPageChange when disabled", () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} disabled />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        fireEvent.click(button);
      });
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("showFirstLast", () => {
    it("hides first/last buttons when showFirstLast is false", () => {
      render(
        <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} showFirstLast={false} />
      );
      expect(screen.queryByLabelText("Go to first page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Go to last page")).not.toBeInTheDocument();
    });

    it("shows first/last buttons by default", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
    });
  });

  describe("showPrevNext", () => {
    it("hides prev/next buttons when showPrevNext is false", () => {
      render(
        <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} showPrevNext={false} />
      );
      expect(screen.queryByLabelText("Go to previous page")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Go to next page")).not.toBeInTheDocument();
    });

    it("shows prev/next buttons by default", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    });
  });

  describe("sizes (CVA)", () => {
    it.each(["sm", "md", "lg"] as const)("renders %s size without errors", (size) => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} size={size} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has aria-label on nav", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
    });

    it("sets aria-current=page on active page button", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to page 5")).toHaveAttribute("aria-current", "page");
    });

    it("does not set aria-current on non-active page buttons", () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to page 4")).not.toHaveAttribute("aria-current");
    });

    it("has aria-label on page buttons", () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 5")).toBeInTheDocument();
    });

    it("has aria-label on navigation buttons", () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to nav element", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<Pagination {...defaultProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("NAV");
    });
  });

  describe("accessibility", () => {
    it("renders as nav with aria-label", () => {
      render(<Pagination {...defaultProps} />);
      const nav = screen.getByRole("navigation", { name: "Pagination" });
      expect(nav).toBeInTheDocument();
    });

    it("has aria-current=page on current page", () => {
      render(<Pagination {...defaultProps} />);
      const currentButton = screen.getByRole("button", { name: "Go to page 5" });
      expect(currentButton).toHaveAttribute("aria-current", "page");
    });

    it("passes axe accessibility checks", async () => {
      const { container } = render(<Pagination {...defaultProps} />);
      await expectNoA11yViolations(container);
    });
  });
});

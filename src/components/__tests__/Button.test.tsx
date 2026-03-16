import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders children correctly", () => {
      render(<Button>Save changes</Button>);
      expect(screen.getByText("Save changes")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Button className="my-custom">Test</Button>);
      expect(screen.getByRole("button")).toHaveClass("my-custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
      render(<Button ref={ref}>Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("spreads additional HTML attributes", () => {
      render(<Button data-testid="my-btn" aria-label="Save">Save</Button>);
      expect(screen.getByTestId("my-btn")).toBeInTheDocument();
      expect(screen.getByLabelText("Save")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders primary variant by default", () => {
      const { container } = render(<Button>Test</Button>);
      expect(container.firstChild).toHaveClass("bg-accent");
    });

    it("renders each variant without errors", () => {
      const variants = ["primary", "neutral", "secondary", "ghost", "danger"] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("sizes", () => {
    it("renders each size without errors", () => {
      const sizes = ["sm", "md", "lg"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<Button size={size}>{size}</Button>);
        expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("props", () => {
    it("renders leftIcon", () => {
      render(<Button leftIcon={<span data-testid="left-icon">L</span>}>Text</Button>);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders rightIcon", () => {
      render(<Button rightIcon={<span data-testid="right-icon">R</span>}>Text</Button>);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("shows spinner and disables when loading", () => {
      const onClick = vi.fn();
      render(<Button loading onClick={onClick}>Save</Button>);
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Test</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("has button role", () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("can have custom type", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });
});

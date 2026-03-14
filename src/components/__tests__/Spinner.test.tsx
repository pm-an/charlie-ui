import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner, sizeMap } from "../Spinner";

describe("Spinner", () => {
  it("renders with role='status'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has default aria-label 'Loading'", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading"
    );
  });

  it("uses custom aria-label via label prop", () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Please wait"
    );
  });

  describe("types", () => {
    it.each(["ring", "dots", "bars", "pulse", "ring-fill"] as const)(
      "renders %s type without crashing",
      (type) => {
        const { container } = render(<Spinner type={type} />);
        expect(container.firstChild).toBeInTheDocument();
      }
    );

    it("renders ring type by default", () => {
      const { container } = render(<Spinner />);
      // Ring type renders a div with animate-spin class
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it.each(["xs", "sm", "md", "lg", "xl"] as const)(
      "renders %s size with correct dimensions",
      (size) => {
        const { container } = render(<Spinner size={size} />);
        const spinner = container.querySelector(".animate-spin") as HTMLElement;
        expect(spinner).toBeInTheDocument();
        expect(spinner.style.width).toBe(`${sizeMap[size]}px`);
        expect(spinner.style.height).toBe(`${sizeMap[size]}px`);
      }
    );

    it("defaults to md size", () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector(".animate-spin") as HTMLElement;
      expect(spinner.style.width).toBe(`${sizeMap.md}px`);
    });
  });

  describe("color", () => {
    it("sets inline color style when color prop is provided", () => {
      render(<Spinner color="#ff0000" data-testid="spinner" />);
      const wrapper = screen.getByTestId("spinner");
      expect(wrapper.style.color).toBe("rgb(255, 0, 0)");
    });

    it("does not set color style when no color prop", () => {
      render(<Spinner data-testid="spinner" />);
      const wrapper = screen.getByTestId("spinner");
      expect(wrapper.style.color).toBe("");
    });
  });

  describe("label", () => {
    it("shows visible label text when showLabel is true", () => {
      render(<Spinner showLabel label="Loading data" />);
      const labelEl = screen.getByText("Loading data");
      expect(labelEl).toBeVisible();
      expect(labelEl).not.toHaveClass("sr-only");
    });

    it("has sr-only class when showLabel is false", () => {
      render(<Spinner label="Loading data" />);
      const labelEl = screen.getByText("Loading data");
      expect(labelEl).toHaveClass("sr-only");
    });

    it("renders default 'Loading' label text in sr-only span", () => {
      render(<Spinner />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });
  });

  describe("className merging", () => {
    it("applies custom className", () => {
      const { container } = render(<Spinner className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("preserves base classes when merging custom className", () => {
      const { container } = render(<Spinner className="my-class" />);
      expect(container.firstChild).toHaveClass("inline-flex");
      expect(container.firstChild).toHaveClass("my-class");
    });
  });

  describe("HTML attributes", () => {
    it("forwards data attributes", () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
    });

    it("forwards id attribute", () => {
      const { container } = render(<Spinner id="spinner-1" />);
      expect(container.querySelector("#spinner-1")).toBeInTheDocument();
    });
  });

  describe("speed", () => {
    it("affects animation duration on ring type", () => {
      const { container } = render(<Spinner speed={2} />);
      const spinner = container.querySelector(".animate-spin") as HTMLElement;
      // speed=2 should halve the base duration of 0.75s -> 0.375s
      expect(spinner.style.animationDuration).toBe("0.375s");
    });

    it("defaults to speed 1", () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector(".animate-spin") as HTMLElement;
      expect(spinner.style.animationDuration).toBe("0.75s");
    });
  });

  describe("thickness", () => {
    it("applies custom thickness to ring type", () => {
      const { container } = render(<Spinner thickness={4} />);
      const spinner = container.querySelector(".animate-spin") as HTMLElement;
      expect(spinner.style.borderWidth).toBe("4px");
    });

    it("uses default thickness when not specified", () => {
      const { container } = render(<Spinner size="md" />);
      const spinner = container.querySelector(".animate-spin") as HTMLElement;
      // md default thickness is 2
      expect(spinner.style.borderWidth).toBe("2px");
    });
  });

  describe("ring-fill type", () => {
    it("renders an SVG", () => {
      const { container } = render(<Spinner type="ring-fill" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders two circles", () => {
      const { container } = render(<Spinner type="ring-fill" />);
      const circles = container.querySelectorAll("circle");
      expect(circles).toHaveLength(2);
    });
  });

  describe("dots type", () => {
    it("renders three dots", () => {
      const { container } = render(<Spinner type="dots" />);
      const wrapper = screen.getByRole("status");
      // Dots are rendered inside a motion.div with rounded-full bg-current children
      const dots = wrapper.querySelectorAll(".rounded-full.bg-current");
      expect(dots).toHaveLength(3);
    });
  });

  describe("bars type", () => {
    it("renders four bars", () => {
      const { container } = render(<Spinner type="bars" />);
      const wrapper = screen.getByRole("status");
      const bars = wrapper.querySelectorAll(".rounded-sm.bg-current");
      expect(bars).toHaveLength(4);
    });
  });

  describe("pulse type", () => {
    it("renders a single pulsing circle", () => {
      const { container } = render(<Spinner type="pulse" />);
      const wrapper = screen.getByRole("status");
      const circles = wrapper.querySelectorAll(".rounded-full.bg-current");
      expect(circles).toHaveLength(1);
    });
  });
});

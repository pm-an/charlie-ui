import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Progress } from "../Progress";

describe("Progress", () => {
  // Basic rendering
  it("renders without crashing", () => {
    const { container } = render(<Progress value={50} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Progress value={50} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(<Progress value={50} data-testid="my-progress" />);
    expect(screen.getByTestId("my-progress")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Progress ref={ref} value={50} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // ARIA attributes
  describe("accessibility", () => {
    it('has role="progressbar"', () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("has aria-valuenow set to value", () => {
      render(<Progress value={42} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "42"
      );
    });

    it("has aria-valuemin set to 0", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemin",
        "0"
      );
    });

    it("has aria-valuemax set to 100", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "100"
      );
    });

    it("has aria-label with percentage", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-label",
        "50% complete"
      );
    });

    it("uses custom label for aria-label", () => {
      render(<Progress value={50} label="Uploading" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-label",
        "Uploading"
      );
    });

    it("does not have aria-valuenow when indeterminate", () => {
      render(<Progress indeterminate />);
      expect(screen.getByRole("progressbar")).not.toHaveAttribute(
        "aria-valuenow"
      );
    });

    it("has aria-label Loading when indeterminate without label", () => {
      render(<Progress indeterminate />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-label",
        "Loading"
      );
    });
  });

  // Value clamping
  describe("value clamping", () => {
    it("clamps value above 100 to 100", () => {
      render(<Progress value={150} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "100"
      );
    });

    it("clamps value below 0 to 0", () => {
      render(<Progress value={-10} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "0"
      );
    });
  });

  // Linear variant
  describe("linear variant", () => {
    it("renders linear variant by default", () => {
      const { container } = render(<Progress value={50} />);
      // Should not contain an SVG (that's circular)
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders the track with overflow-hidden", () => {
      const { container } = render(<Progress value={50} />);
      expect(container.querySelector(".overflow-hidden")).toBeInTheDocument();
    });

    it("sets fill bar width based on value", () => {
      const { container } = render(<Progress value={75} />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill.style.width).toBe("75%");
    });

    it("shows percentage text when showValue is true", () => {
      render(<Progress value={42} showValue />);
      expect(screen.getByText("42%")).toBeInTheDocument();
    });

    it("does not show percentage text when showValue is false", () => {
      render(<Progress value={42} />);
      expect(screen.queryByText("42%")).not.toBeInTheDocument();
    });

    it("does not show percentage when indeterminate even with showValue", () => {
      render(<Progress indeterminate showValue />);
      expect(screen.queryByText("0%")).not.toBeInTheDocument();
    });

    it("renders label text", () => {
      render(<Progress value={50} label="Uploading files..." />);
      expect(screen.getByText("Uploading files...")).toBeInTheDocument();
    });
  });

  // Sizes (linear)
  describe("linear sizes", () => {
    it("applies sm size class", () => {
      const { container } = render(<Progress value={50} size="sm" />);
      expect(container.querySelector(".h-1")).toBeInTheDocument();
    });

    it("applies md size class", () => {
      const { container } = render(<Progress value={50} size="md" />);
      expect(container.querySelector(".h-2")).toBeInTheDocument();
    });

    it("applies lg size class", () => {
      const { container } = render(<Progress value={50} size="lg" />);
      expect(container.querySelector(".h-3")).toBeInTheDocument();
    });
  });

  // Colors (linear)
  describe("linear colors", () => {
    it("applies accent color (default)", () => {
      const { container } = render(<Progress value={50} />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill).toHaveClass("bg-accent");
    });

    it("applies blue color", () => {
      const { container } = render(<Progress value={50} color="blue" />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill).toHaveClass("bg-blue");
    });

    it("applies green color", () => {
      const { container } = render(<Progress value={50} color="green" />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill).toHaveClass("bg-green");
    });

    it("applies yellow color", () => {
      const { container } = render(<Progress value={50} color="yellow" />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill).toHaveClass("bg-yellow");
    });
  });

  // Indeterminate (linear)
  describe("linear indeterminate", () => {
    it("applies indeterminate animation class", () => {
      const { container } = render(<Progress indeterminate />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill).toHaveClass("animate-progress-indeterminate");
    });

    it("sets 40% width when indeterminate", () => {
      const { container } = render(<Progress indeterminate />);
      const track = container.querySelector(".overflow-hidden");
      const fill = track?.firstChild as HTMLElement;
      expect(fill.style.width).toBe("40%");
    });
  });

  // Circular variant
  describe("circular variant", () => {
    it("renders SVG for circular variant", () => {
      const { container } = render(
        <Progress variant="circular" value={50} />
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders two circles (track + progress)", () => {
      const { container } = render(
        <Progress variant="circular" value={50} />
      );
      const circles = container.querySelectorAll("circle");
      expect(circles).toHaveLength(2);
    });

    it("shows percentage text when showValue is true", () => {
      render(<Progress variant="circular" value={72} showValue />);
      expect(screen.getByText("72%")).toBeInTheDocument();
    });

    it("does not show percentage when showValue is false", () => {
      render(<Progress variant="circular" value={72} />);
      expect(screen.queryByText("72%")).not.toBeInTheDocument();
    });

    it("does not show percentage when indeterminate even with showValue", () => {
      render(<Progress variant="circular" indeterminate showValue />);
      expect(screen.queryByText("0%")).not.toBeInTheDocument();
    });

    it("renders label below the circle", () => {
      render(
        <Progress variant="circular" value={50} label="Health score" />
      );
      expect(screen.getByText("Health score")).toBeInTheDocument();
    });

    it("has round stroke linecap on progress circle", () => {
      const { container } = render(
        <Progress variant="circular" value={50} />
      );
      const circles = container.querySelectorAll("circle");
      const progressCircle = circles[1];
      expect(progressCircle).toHaveAttribute("stroke-linecap", "round");
    });
  });

  // Circular sizes
  describe("circular sizes", () => {
    it("renders sm size (32px)", () => {
      const { container } = render(
        <Progress variant="circular" value={50} size="sm" />
      );
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("width", "32");
      expect(svg).toHaveAttribute("height", "32");
    });

    it("renders md size (48px)", () => {
      const { container } = render(
        <Progress variant="circular" value={50} size="md" />
      );
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("width", "48");
      expect(svg).toHaveAttribute("height", "48");
    });

    it("renders lg size (64px)", () => {
      const { container } = render(
        <Progress variant="circular" value={50} size="lg" />
      );
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("width", "64");
      expect(svg).toHaveAttribute("height", "64");
    });
  });

  // Circular indeterminate
  describe("circular indeterminate", () => {
    it("applies spin animation", () => {
      const { container } = render(
        <Progress variant="circular" indeterminate />
      );
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveClass("animate-spin");
    });
  });

  // All variants render
  describe("all variant/size/color combinations render", () => {
    it.each(["linear", "circular"] as const)(
      "renders %s variant",
      (variant) => {
        const { container } = render(
          <Progress variant={variant} value={50} />
        );
        expect(container.firstChild).toBeInTheDocument();
      }
    );

    it.each(["sm", "md", "lg"] as const)(
      "renders %s size",
      (size) => {
        const { container } = render(<Progress value={50} size={size} />);
        expect(container.firstChild).toBeInTheDocument();
      }
    );

    it.each(["accent", "blue", "green", "yellow"] as const)(
      "renders %s color",
      (color) => {
        const { container } = render(<Progress value={50} color={color} />);
        expect(container.firstChild).toBeInTheDocument();
      }
    );
  });
});

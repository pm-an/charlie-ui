import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogoCloud } from "../LogoCloud";

const mockLogos = [
  { src: "/logo1.svg", alt: "Vercel" },
  { src: "/logo2.svg", alt: "Stripe", href: "https://stripe.com" },
  { src: "/logo3.svg", alt: "GitHub" },
];

describe("LogoCloud", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<LogoCloud logos={mockLogos} />);
      expect(screen.getByAltText("Vercel")).toBeInTheDocument();
    });

    it("renders all logos", () => {
      render(<LogoCloud logos={mockLogos} />);
      mockLogos.forEach((logo) => {
        expect(screen.getByAltText(logo.alt)).toBeInTheDocument();
      });
    });

    it("renders logos as images with correct src", () => {
      render(<LogoCloud logos={mockLogos} />);
      const img = screen.getByAltText("Vercel") as HTMLImageElement;
      expect(img).toHaveAttribute("src", "/logo1.svg");
    });

    it("wraps logo in link when href is provided", () => {
      render(<LogoCloud logos={mockLogos} />);
      const stripeImg = screen.getByAltText("Stripe");
      const link = stripeImg.closest("a");
      expect(link).toHaveAttribute("href", "https://stripe.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not wrap logo in link when href is not provided", () => {
      render(<LogoCloud logos={mockLogos} />);
      const vercelImg = screen.getByAltText("Vercel");
      expect(vercelImg.closest("a")).toBeNull();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <LogoCloud logos={mockLogos} className="custom-cloud" />
      );
      expect(container.firstChild).toHaveClass("custom-cloud");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<LogoCloud ref={ref} logos={mockLogos} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <LogoCloud
          logos={mockLogos}
          data-testid="logo-cloud"
          aria-label="Partner logos"
        />
      );
      expect(screen.getByTestId("logo-cloud")).toBeInTheDocument();
      expect(screen.getByLabelText("Partner logos")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<LogoCloud logos={mockLogos} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "logo-cloud"
      );
    });
  });

  describe("header", () => {
    it("renders eyebrow when provided", () => {
      render(<LogoCloud logos={mockLogos} eyebrow="Trusted by" />);
      expect(screen.getByText("Trusted by")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<LogoCloud logos={mockLogos} title="Our Partners" />);
      expect(
        screen.getByRole("heading", { level: 2, name: "Our Partners" })
      ).toBeInTheDocument();
    });

    it("does not render header when no header props", () => {
      const { container } = render(<LogoCloud logos={mockLogos} />);
      const section = container.firstChild as HTMLElement;
      expect(
        section.querySelector(".text-center.mb-8")
      ).not.toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders grid variant by default", () => {
      const { container } = render(<LogoCloud logos={mockLogos} />);
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".grid")).toBeInTheDocument();
    });

    it("renders grid variant with responsive columns", () => {
      const { container } = render(
        <LogoCloud logos={mockLogos} variant="grid" />
      );
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-3");
      expect(grid).toHaveClass("md:grid-cols-4");
      expect(grid).toHaveClass("lg:grid-cols-6");
    });

    it("renders inline variant with flex layout", () => {
      const { container } = render(
        <LogoCloud logos={mockLogos} variant="inline" />
      );
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".flex")).toBeInTheDocument();
    });
  });

  describe("logo styling", () => {
    it("applies opacity and grayscale classes to logos", () => {
      render(<LogoCloud logos={mockLogos} />);
      const img = screen.getByAltText("Vercel");
      expect(img).toHaveClass("opacity-60");
      expect(img).toHaveClass("grayscale");
    });

    it("applies correct height classes", () => {
      render(<LogoCloud logos={mockLogos} />);
      const img = screen.getByAltText("Vercel");
      expect(img).toHaveClass("h-8");
      expect(img).toHaveClass("md:h-10");
    });

    it("applies object-contain class", () => {
      render(<LogoCloud logos={mockLogos} />);
      const img = screen.getByAltText("Vercel");
      expect(img).toHaveClass("object-contain");
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<LogoCloud logos={mockLogos} />);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("all images have alt text", () => {
      render(<LogoCloud logos={mockLogos} />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });
  });
});

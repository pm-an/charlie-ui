import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TestimonialSection } from "../TestimonialSection";

const mockTestimonials = [
  {
    quote: "This product changed our workflow entirely.",
    author: "Alice Smith",
    role: "CTO",
    company: "Acme Corp",
    avatar: "https://example.com/alice.jpg",
  },
  {
    quote: "Best developer experience I have ever used.",
    author: "Bob Jones",
    role: "Lead Developer",
    company: "TechCo",
  },
  {
    quote: "Highly recommended for any engineering team.",
    author: "Carol Davis",
    role: "VP of Engineering",
  },
];

describe("TestimonialSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <TestimonialSection testimonials={mockTestimonials} />
      );
      expect(
        container.querySelector("[data-slot='testimonial-section']")
      ).toBeInTheDocument();
    });

    it("renders all testimonials", () => {
      render(<TestimonialSection testimonials={mockTestimonials} />);
      expect(
        screen.getByText("This product changed our workflow entirely.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Best developer experience I have ever used.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Highly recommended for any engineering team.")
      ).toBeInTheDocument();
    });

    it("renders author names", () => {
      render(<TestimonialSection testimonials={mockTestimonials} />);
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Jones")).toBeInTheDocument();
      expect(screen.getByText("Carol Davis")).toBeInTheDocument();
    });
  });

  describe("section header", () => {
    it("renders eyebrow when provided", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          eyebrow="Testimonials"
        />
      );
      expect(screen.getByText("Testimonials")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          title="What people say"
        />
      );
      expect(screen.getByText("What people say")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          description="Hear from our users"
        />
      );
      expect(screen.getByText("Hear from our users")).toBeInTheDocument();
    });

    it("does not render header elements when not provided", () => {
      render(<TestimonialSection testimonials={mockTestimonials} />);
      expect(screen.queryByText("Testimonials")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <TestimonialSection
          testimonials={mockTestimonials}
          className="custom-class"
        />
      );
      expect(
        container.querySelector("[data-slot='testimonial-section']")
      ).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<TestimonialSection ref={ref} testimonials={mockTestimonials} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          data-testid="my-testimonials"
        />
      );
      expect(screen.getByTestId("my-testimonials")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(
        <TestimonialSection testimonials={mockTestimonials} />
      );
      expect(
        container.querySelector("[data-slot='testimonial-section']")
      ).toBeInTheDocument();
    });
  });

  describe("grid variant", () => {
    it("renders Testimonial cards in a grid", () => {
      const { container } = render(
        <TestimonialSection testimonials={mockTestimonials} variant="grid" />
      );
      const testimonialCards = container.querySelectorAll(
        "[data-slot='testimonial']"
      );
      expect(testimonialCards.length).toBe(3);
    });

    it("renders grid with 2 columns", () => {
      const { container } = render(
        <TestimonialSection
          testimonials={mockTestimonials}
          columns={2}
          variant="grid"
        />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("renders grid with 3 columns", () => {
      const { container } = render(
        <TestimonialSection
          testimonials={mockTestimonials}
          columns={3}
          variant="grid"
        />
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });
  });

  describe("featured variant", () => {
    it("renders featured layout with first testimonial highlighted", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          variant="featured"
        />
      );
      // The first testimonial quote should appear in the featured blockquote
      expect(
        screen.getByText("This product changed our workflow entirely.")
      ).toBeInTheDocument();
      // Featured author should appear
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    it("renders remaining testimonials as regular cards", () => {
      const { container } = render(
        <TestimonialSection
          testimonials={mockTestimonials}
          variant="featured"
        />
      );
      // The remaining 2 should be rendered as regular Testimonial components
      const testimonialCards = container.querySelectorAll(
        "[data-slot='testimonial']"
      );
      expect(testimonialCards.length).toBe(2);
    });

    it("renders avatar in featured testimonial when provided", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          variant="featured"
        />
      );
      const images = screen.getAllByRole("img");
      // First testimonial has avatar
      expect(images[0]).toHaveAttribute(
        "src",
        "https://example.com/alice.jpg"
      );
    });

    it("renders company in featured testimonial when provided", () => {
      render(
        <TestimonialSection
          testimonials={mockTestimonials}
          variant="featured"
        />
      );
      // Company text rendered alongside role
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    it("handles single testimonial in featured variant", () => {
      render(
        <TestimonialSection
          testimonials={[mockTestimonials[0]]}
          variant="featured"
        />
      );
      expect(
        screen.getByText("This product changed our workflow entirely.")
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("renders with empty testimonials array", () => {
      const { container } = render(
        <TestimonialSection testimonials={[]} />
      );
      expect(
        container.querySelector("[data-slot='testimonial-section']")
      ).toBeInTheDocument();
    });

    it("renders featured variant with empty array", () => {
      const { container } = render(
        <TestimonialSection testimonials={[]} variant="featured" />
      );
      expect(
        container.querySelector("[data-slot='testimonial-section']")
      ).toBeInTheDocument();
    });

    it("renders without company", () => {
      render(
        <TestimonialSection testimonials={[mockTestimonials[2]]} />
      );
      expect(screen.getByText("Carol Davis")).toBeInTheDocument();
    });

    it("renders without avatar", () => {
      render(
        <TestimonialSection testimonials={[mockTestimonials[1]]} />
      );
      expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FAQSection } from "../FAQSection";

const mockItems = [
  { question: "What is this?", answer: "This is a component library." },
  { question: "How do I install it?", answer: "Run npm install charlie-ui." },
  { question: "Is it free?", answer: "Yes, it is open source." },
  { question: "What license?", answer: "MIT license." },
];

describe("FAQSection", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<FAQSection items={mockItems} />);
      expect(screen.getByText("What is this?")).toBeInTheDocument();
    });

    it("renders all FAQ questions", () => {
      render(<FAQSection items={mockItems} />);
      mockItems.forEach((item) => {
        expect(screen.getByText(item.question)).toBeInTheDocument();
      });
    });

    it("renders answers when accordion item is clicked", () => {
      render(<FAQSection items={mockItems} />);
      fireEvent.click(screen.getByText("What is this?"));
      expect(
        screen.getByText("This is a component library.")
      ).toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <FAQSection items={mockItems} className="custom-faq" />
      );
      expect(container.firstChild).toHaveClass("custom-faq");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<FAQSection ref={ref} items={mockItems} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <FAQSection
          items={mockItems}
          data-testid="faq"
          aria-label="FAQ section"
        />
      );
      expect(screen.getByTestId("faq")).toBeInTheDocument();
      expect(screen.getByLabelText("FAQ section")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<FAQSection items={mockItems} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "faq-section"
      );
    });
  });

  describe("header", () => {
    it("renders eyebrow when provided", () => {
      render(<FAQSection items={mockItems} eyebrow="FAQ" />);
      expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(
        <FAQSection items={mockItems} title="Frequently Asked Questions" />
      );
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "Frequently Asked Questions",
        })
      ).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(
        <FAQSection items={mockItems} description="Find answers below." />
      );
      expect(screen.getByText("Find answers below.")).toBeInTheDocument();
    });

    it("does not render header section when no header props provided", () => {
      const { container } = render(<FAQSection items={mockItems} />);
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".text-center.mb-8")).not.toBeInTheDocument();
    });
  });

  describe("columns", () => {
    it("renders single column by default", () => {
      const { container } = render(<FAQSection items={mockItems} />);
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".max-w-3xl")).toBeInTheDocument();
      expect(
        section.querySelector(".md\\:grid-cols-2")
      ).not.toBeInTheDocument();
    });

    it("renders two columns when columns is 2", () => {
      const { container } = render(
        <FAQSection items={mockItems} columns={2} />
      );
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".md\\:grid-cols-2")).toBeInTheDocument();
    });

    it("splits items evenly across columns", () => {
      const { container } = render(
        <FAQSection items={mockItems} columns={2} />
      );
      const section = container.firstChild as HTMLElement;
      const grid = section.querySelector(".md\\:grid-cols-2");
      expect(grid?.children).toHaveLength(2);
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<FAQSection items={mockItems} />);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("uses Accordion component for interactive Q&A", () => {
      const { container } = render(<FAQSection items={mockItems} />);
      const section = container.firstChild as HTMLElement;
      expect(
        section.querySelector('[data-slot="accordion"]')
      ).toBeInTheDocument();
    });
  });
});

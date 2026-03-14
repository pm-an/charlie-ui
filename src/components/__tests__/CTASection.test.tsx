import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CTASection } from "../CTASection";

describe("CTASection", () => {
  const requiredProps = {
    title: "Get Started Today",
    description: "Join thousands of developers shipping faster.",
  };

  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<CTASection {...requiredProps} />);
      expect(screen.getByText("Get Started Today")).toBeInTheDocument();
    });

    it("renders title and description", () => {
      render(<CTASection {...requiredProps} />);
      expect(screen.getByText("Get Started Today")).toBeInTheDocument();
      expect(
        screen.getByText("Join thousands of developers shipping faster.")
      ).toBeInTheDocument();
    });

    it("renders actions when provided", () => {
      render(
        <CTASection
          {...requiredProps}
          actions={<button>Sign Up</button>}
        />
      );
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("does not render actions wrapper when actions not provided", () => {
      const { container } = render(<CTASection {...requiredProps} />);
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".flex.gap-4")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <CTASection {...requiredProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLElement | null>;
      render(<CTASection ref={ref} {...requiredProps} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <CTASection
          {...requiredProps}
          data-testid="cta"
          aria-label="Call to action"
        />
      );
      expect(screen.getByTestId("cta")).toBeInTheDocument();
      expect(screen.getByLabelText("Call to action")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      const { container } = render(<CTASection {...requiredProps} />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "cta-section"
      );
    });
  });

  describe("variants", () => {
    it("renders simple variant by default", () => {
      const { container } = render(<CTASection {...requiredProps} />);
      expect(container.firstChild).toHaveClass("relative");
    });

    it("renders gradient variant with aurora overlay", () => {
      const { container } = render(
        <CTASection {...requiredProps} variant="gradient" />
      );
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".bg-aurora")).toBeInTheDocument();
    });

    it("does not render aurora overlay for simple variant", () => {
      const { container } = render(
        <CTASection {...requiredProps} variant="simple" />
      );
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".bg-aurora")).not.toBeInTheDocument();
    });

    it("renders split variant with two-column layout", () => {
      const { container } = render(
        <CTASection
          {...requiredProps}
          variant="split"
          actions={<button>Go</button>}
        />
      );
      const section = container.firstChild as HTMLElement;
      // Split uses flex layout with md:flex-row
      const flexContainer = section.querySelector(".md\\:flex-row");
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe("alignment", () => {
    it("centers text by default", () => {
      const { container } = render(<CTASection {...requiredProps} />);
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".text-center")).toBeInTheDocument();
    });

    it("left-aligns text when align is left", () => {
      const { container } = render(
        <CTASection {...requiredProps} align="left" />
      );
      const section = container.firstChild as HTMLElement;
      expect(section.querySelector(".text-center")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders as a section element", () => {
      const { container } = render(<CTASection {...requiredProps} />);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renders title as h2", () => {
      render(<CTASection {...requiredProps} />);
      expect(
        screen.getByRole("heading", { level: 2, name: "Get Started Today" })
      ).toBeInTheDocument();
    });
  });
});

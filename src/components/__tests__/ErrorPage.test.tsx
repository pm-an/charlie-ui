import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ErrorPage } from "../ErrorPage";

describe("ErrorPage", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ErrorPage code="404" data-testid="error" />);
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("has data-slot attribute", () => {
      render(<ErrorPage code="404" data-testid="error" />);
      expect(screen.getByTestId("error")).toHaveAttribute("data-slot", "error-page");
    });

    it("applies custom className", () => {
      render(<ErrorPage code="404" className="custom" data-testid="error" />);
      expect(screen.getByTestId("error")).toHaveClass("custom");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ErrorPage ref={ref} code="404" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has min-h-screen and flex centering", () => {
      render(<ErrorPage code="404" data-testid="error" />);
      const el = screen.getByTestId("error");
      expect(el).toHaveClass("min-h-screen");
      expect(el).toHaveClass("flex");
      expect(el).toHaveClass("items-center");
      expect(el).toHaveClass("justify-center");
    });

    it("spreads additional HTML attributes", () => {
      render(<ErrorPage code="404" aria-label="Error" data-testid="error" />);
      expect(screen.getByTestId("error")).toHaveAttribute("aria-label", "Error");
    });
  });

  describe("default titles and descriptions", () => {
    it("shows default 404 content", () => {
      render(<ErrorPage code="404" />);
      expect(screen.getByText("Page not found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "The page you're looking for doesn't exist or has been moved."
        )
      ).toBeInTheDocument();
    });

    it("shows default 500 content", () => {
      render(<ErrorPage code="500" />);
      expect(screen.getByText("Server error")).toBeInTheDocument();
      expect(
        screen.getByText("Something went wrong on our end. Please try again later.")
      ).toBeInTheDocument();
    });

    it("shows default 503 content", () => {
      render(<ErrorPage code="503" />);
      expect(screen.getByText("Service unavailable")).toBeInTheDocument();
      expect(
        screen.getByText("We're temporarily offline for maintenance.")
      ).toBeInTheDocument();
    });

    it("shows default maintenance content", () => {
      render(<ErrorPage code="maintenance" />);
      expect(screen.getByText("Under maintenance")).toBeInTheDocument();
      expect(
        screen.getByText("We're making some improvements. We'll be back shortly.")
      ).toBeInTheDocument();
    });

    it("shows default coming-soon content", () => {
      render(<ErrorPage code="coming-soon" />);
      expect(screen.getByText("Coming soon")).toBeInTheDocument();
      expect(
        screen.getByText("We're working on something exciting. Stay tuned!")
      ).toBeInTheDocument();
    });
  });

  describe("custom title and description", () => {
    it("overrides default title", () => {
      render(<ErrorPage code="404" title="Lost in space" />);
      expect(screen.getByText("Lost in space")).toBeInTheDocument();
      expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
    });

    it("overrides default description", () => {
      render(<ErrorPage code="500" description="Custom error message" />);
      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });
  });

  describe("numeric code display", () => {
    it("displays numeric codes as large text", () => {
      render(<ErrorPage code="404" />);
      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("displays 500 code", () => {
      render(<ErrorPage code="500" />);
      expect(screen.getByText("500")).toBeInTheDocument();
    });

    it("displays 503 code", () => {
      render(<ErrorPage code="503" />);
      expect(screen.getByText("503")).toBeInTheDocument();
    });

    it("does not display code text for non-numeric codes", () => {
      render(<ErrorPage code="maintenance" />);
      expect(screen.queryByText("maintenance")).not.toBeInTheDocument();
    });
  });

  describe("action and backHref", () => {
    it("renders action when provided", () => {
      render(
        <ErrorPage
          code="500"
          action={<button data-testid="retry">Retry</button>}
        />
      );
      expect(screen.getByTestId("retry")).toBeInTheDocument();
    });

    it("renders Go home link when backHref is provided", () => {
      render(<ErrorPage code="404" backHref="/" />);
      const link = screen.getByText("Go home");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/");
    });

    it("renders both action and backHref", () => {
      render(
        <ErrorPage
          code="500"
          action={<button>Retry</button>}
          backHref="/"
        />
      );
      expect(screen.getByText("Retry")).toBeInTheDocument();
      expect(screen.getByText("Go home")).toBeInTheDocument();
    });

    it("does not render action area when no action or backHref", () => {
      const { container } = render(<ErrorPage code="404" />);
      expect(container.querySelector("a")).not.toBeInTheDocument();
    });
  });
});

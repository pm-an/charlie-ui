import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Alert } from "../Alert";

describe("Alert", () => {
  it("renders without crashing", () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Alert title="Heads up">Details here</Alert>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });

  it("renders children as description", () => {
    render(<Alert>Description text</Alert>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("renders title only without description", () => {
    render(<Alert title="Title only" />);
    expect(screen.getByText("Title only")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Alert className="custom-class">Test</Alert>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    render(<Alert data-testid="my-alert">Test</Alert>);
    expect(screen.getByTestId("my-alert")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Alert ref={ref}>Test</Alert>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // Variant rendering
  describe("variants", () => {
    it.each(["default", "info", "success", "warning", "error"] as const)(
      "renders %s variant without error",
      (variant) => {
        render(<Alert variant={variant}>Content</Alert>);
        expect(screen.getByText("Content")).toBeInTheDocument();
      }
    );

    it("applies info variant classes", () => {
      const { container } = render(<Alert variant="info">Test</Alert>);
      expect(container.firstChild).toHaveClass("border-blue/20");
    });

    it("applies success variant classes", () => {
      const { container } = render(<Alert variant="success">Test</Alert>);
      expect(container.firstChild).toHaveClass("border-green/20");
    });

    it("applies warning variant classes", () => {
      const { container } = render(<Alert variant="warning">Test</Alert>);
      expect(container.firstChild).toHaveClass("border-yellow/20");
    });

    it("applies error variant classes", () => {
      const { container } = render(<Alert variant="error">Test</Alert>);
      expect(container.firstChild).toHaveClass("border-red/20");
    });

    it("applies default variant classes", () => {
      const { container } = render(<Alert variant="default">Test</Alert>);
      expect(container.firstChild).toHaveClass("border-border");
    });
  });

  // Auto icons
  describe("auto icons", () => {
    it("renders auto icon for info variant", () => {
      const { container } = render(<Alert variant="info">Test</Alert>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders auto icon for success variant", () => {
      const { container } = render(<Alert variant="success">Test</Alert>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders auto icon for warning variant", () => {
      const { container } = render(<Alert variant="warning">Test</Alert>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders auto icon for error variant", () => {
      const { container } = render(<Alert variant="error">Test</Alert>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("does not render auto icon for default variant", () => {
      const { container } = render(<Alert variant="default">Test</Alert>);
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      render(
        <Alert variant="info" icon={<span data-testid="custom-icon">!</span>}>
          Test
        </Alert>
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  // Close button
  describe("closable", () => {
    it("does not render close button by default", () => {
      render(<Alert>Test</Alert>);
      expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
    });

    it("renders close button when closable is true", () => {
      render(<Alert closable>Test</Alert>);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(
        <Alert closable onClose={onClose}>
          Test
        </Alert>
      );
      fireEvent.click(screen.getByLabelText("Close"));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("renders close button even without onClose handler", () => {
      render(<Alert closable>Test</Alert>);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });
  });

  // Action
  describe("action", () => {
    it("renders action content", () => {
      render(<Alert action={<button>Retry</button>}>Test</Alert>);
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });

    it("does not render action container when no action provided", () => {
      const { container } = render(<Alert>Test</Alert>);
      // Should only have the content div, no extra action wrapper
      expect(container.querySelectorAll(".mt-2")).toHaveLength(0);
    });
  });

  // ARIA roles
  describe("accessibility", () => {
    it('has role="alert" for error variant', () => {
      render(<Alert variant="error">Error message</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it('has role="alert" for warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it('has role="status" for info variant', () => {
      render(<Alert variant="info">Info message</Alert>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it('has role="status" for success variant', () => {
      render(<Alert variant="success">Success message</Alert>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it('has role="status" for default variant', () => {
      render(<Alert variant="default">Default message</Alert>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("close button has accessible label", () => {
      render(<Alert closable>Test</Alert>);
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });
  });

  // Description spacing
  it("adds mt-1 to description when title is present", () => {
    const { container } = render(
      <Alert title="Title">Description</Alert>
    );
    const description = container.querySelector(".mt-1");
    expect(description).toBeInTheDocument();
  });

  it("does not add mt-1 to description when no title", () => {
    const { container } = render(<Alert>Description only</Alert>);
    const description = container.querySelector(".mt-1");
    expect(description).not.toBeInTheDocument();
  });
});

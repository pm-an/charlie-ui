import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<ForgotPasswordForm />);
      expect(screen.getByText("Reset your password")).toBeInTheDocument();
    });

    it("renders default title and description", () => {
      render(<ForgotPasswordForm />);
      expect(screen.getByText("Reset your password")).toBeInTheDocument();
      expect(
        screen.getByText("Enter your email and we'll send you a reset link")
      ).toBeInTheDocument();
    });

    it("renders custom title and description", () => {
      render(
        <ForgotPasswordForm title="Forgot?" description="We got you" />
      );
      expect(screen.getByText("Forgot?")).toBeInTheDocument();
      expect(screen.getByText("We got you")).toBeInTheDocument();
    });

    it("renders email input", () => {
      render(<ForgotPasswordForm />);
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<ForgotPasswordForm />);
      expect(
        screen.getByRole("button", { name: "Send reset link" })
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ForgotPasswordForm className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<ForgotPasswordForm ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<ForgotPasswordForm />);
      expect(container.firstChild).toHaveAttribute(
        "data-slot",
        "forgot-password-form"
      );
    });

    it("spreads additional HTML attributes", () => {
      render(<ForgotPasswordForm data-testid="forgot-card" />);
      expect(screen.getByTestId("forgot-card")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with email", () => {
      const onSubmit = vi.fn();
      render(<ForgotPasswordForm onSubmit={onSubmit} />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.click(
        screen.getByRole("button", { name: "Send reset link" })
      );

      expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("does not crash when onSubmit is not provided", () => {
      render(<ForgotPasswordForm />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      expect(() => {
        fireEvent.click(
          screen.getByRole("button", { name: "Send reset link" })
        );
      }).not.toThrow();
    });
  });

  describe("conditional rendering", () => {
    it("renders login link when loginHref provided", () => {
      render(<ForgotPasswordForm loginHref="/login" />);
      const link = screen.getByText("Back to sign in");
      expect(link).toHaveAttribute("href", "/login");
    });

    it("renders custom login label", () => {
      render(
        <ForgotPasswordForm loginHref="/login" loginLabel="Return to login" />
      );
      const link = screen.getByText("Return to login");
      expect(link).toHaveAttribute("href", "/login");
    });

    it("does not render login link by default", () => {
      render(<ForgotPasswordForm />);
      expect(screen.queryByText("Back to sign in")).not.toBeInTheDocument();
    });

    it("renders logo when provided", () => {
      render(
        <ForgotPasswordForm logo={<div data-testid="logo">Logo</div>} />
      );
      expect(screen.getByTestId("logo")).toBeInTheDocument();
    });

    it("does not render logo by default", () => {
      const { container } = render(<ForgotPasswordForm />);
      expect(
        container.querySelector("[data-testid='logo']")
      ).not.toBeInTheDocument();
    });
  });

  describe("input validation", () => {
    it("email input has type email", () => {
      render(<ForgotPasswordForm />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    });

    it("email input is required", () => {
      render(<ForgotPasswordForm />);
      expect(screen.getByLabelText("Email")).toBeRequired();
    });
  });
});

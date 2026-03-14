import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignupForm } from "../SignupForm";
import { expectNoA11yViolations } from "../../test/a11y";

describe("SignupForm", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<SignupForm />);
      expect(screen.getByText("Create your account")).toBeInTheDocument();
    });

    it("renders default title and description", () => {
      render(<SignupForm />);
      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByText("Start your free trial today")).toBeInTheDocument();
    });

    it("renders custom title and description", () => {
      render(<SignupForm title="Join us" description="Get started" />);
      expect(screen.getByText("Join us")).toBeInTheDocument();
      expect(screen.getByText("Get started")).toBeInTheDocument();
    });

    it("renders all form inputs", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Full name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<SignupForm />);
      expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
    });

    it("renders password strength hint", () => {
      render(<SignupForm />);
      expect(screen.getByText("Must be at least 8 characters")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<SignupForm className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<SignupForm ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<SignupForm />);
      expect(container.firstChild).toHaveAttribute("data-slot", "signup-form");
    });

    it("spreads additional HTML attributes", () => {
      render(<SignupForm data-testid="signup-card" />);
      expect(screen.getByTestId("signup-card")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with name, email, and password", () => {
      const onSubmit = vi.fn();
      render(<SignupForm onSubmit={onSubmit} showTerms={false} />);

      fireEvent.change(screen.getByLabelText("Full name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "securepass123" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Create account" }));

      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass123",
      });
    });
  });

  describe("conditional rendering", () => {
    it("renders terms checkbox by default", () => {
      render(<SignupForm />);
      expect(screen.getByText(/I agree to the/)).toBeInTheDocument();
    });

    it("renders terms and privacy links", () => {
      render(<SignupForm />);
      expect(screen.getByText("Terms of Service")).toHaveAttribute("href", "#");
      expect(screen.getByText("Privacy Policy")).toHaveAttribute("href", "#");
    });

    it("renders custom terms and privacy hrefs", () => {
      render(<SignupForm termsHref="/terms" privacyHref="/privacy" />);
      expect(screen.getByText("Terms of Service")).toHaveAttribute("href", "/terms");
      expect(screen.getByText("Privacy Policy")).toHaveAttribute("href", "/privacy");
    });

    it("hides terms when showTerms is false", () => {
      render(<SignupForm showTerms={false} />);
      expect(screen.queryByText(/I agree to the/)).not.toBeInTheDocument();
    });

    it("renders login link when loginHref provided", () => {
      render(<SignupForm loginHref="/login" />);
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      const signInLink = screen.getByText("Sign in");
      expect(signInLink).toHaveAttribute("href", "/login");
    });

    it("renders custom login label", () => {
      render(<SignupForm loginHref="/login" loginLabel="Have an account?" />);
      expect(screen.getByText("Have an account?")).toBeInTheDocument();
    });

    it("does not render login link by default", () => {
      render(<SignupForm />);
      expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
    });

    it("renders logo when provided", () => {
      render(<SignupForm logo={<div data-testid="logo">Logo</div>} />);
      expect(screen.getByTestId("logo")).toBeInTheDocument();
    });

    it("does not render logo by default", () => {
      const { container } = render(<SignupForm />);
      expect(container.querySelector("[data-testid='logo']")).not.toBeInTheDocument();
    });
  });

  describe("social providers", () => {
    it("renders social provider buttons", () => {
      const onClick = vi.fn();
      render(
        <SignupForm
          socialProviders={[
            {
              name: "GitHub",
              icon: <span data-testid="github-icon">GH</span>,
              onClick,
            },
            {
              name: "Google",
              icon: <span data-testid="google-icon">G</span>,
              onClick,
            },
          ]}
        />
      );
      expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
      expect(screen.getByText("Continue with Google")).toBeInTheDocument();
      expect(screen.getByTestId("github-icon")).toBeInTheDocument();
      expect(screen.getByTestId("google-icon")).toBeInTheDocument();
    });

    it("renders or divider when social providers present", () => {
      render(
        <SignupForm
          socialProviders={[
            {
              name: "GitHub",
              icon: <span>GH</span>,
              onClick: vi.fn(),
            },
          ]}
        />
      );
      expect(screen.getByText("or")).toBeInTheDocument();
    });

    it("does not render social section when no providers", () => {
      render(<SignupForm />);
      expect(screen.queryByText("or")).not.toBeInTheDocument();
    });

    it("calls social provider onClick when clicked", () => {
      const onClick = vi.fn();
      render(
        <SignupForm
          socialProviders={[
            {
              name: "GitHub",
              icon: <span>GH</span>,
              onClick,
            },
          ]}
        />
      );
      fireEvent.click(screen.getByText("Continue with GitHub"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("input validation", () => {
    it("name input has type text", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Full name")).toHaveAttribute("type", "text");
    });

    it("email input has type email", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    });

    it("password input has type password", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    });

    it("name input is required", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Full name")).toBeRequired();
    });

    it("email input is required", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Email")).toBeRequired();
    });

    it("password input is required", () => {
      render(<SignupForm />);
      expect(screen.getByLabelText("Password")).toBeRequired();
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = render(<SignupForm />);
      await expectNoA11yViolations(container);
    });
  });
});

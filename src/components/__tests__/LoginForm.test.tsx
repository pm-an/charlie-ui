import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "../LoginForm";
import { expectNoA11yViolations } from "../../test/a11y";

describe("LoginForm", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      render(<LoginForm />);
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
    });

    it("renders default title and description", () => {
      render(<LoginForm />);
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });

    it("renders custom title and description", () => {
      render(<LoginForm title="Hello" description="Log in now" />);
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Log in now")).toBeInTheDocument();
    });

    it("renders email and password inputs", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<LoginForm />);
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<LoginForm className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<LoginForm ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("has data-slot attribute", () => {
      const { container } = render(<LoginForm />);
      expect(container.firstChild).toHaveAttribute("data-slot", "login-form");
    });

    it("spreads additional HTML attributes", () => {
      render(<LoginForm data-testid="login-card" />);
      expect(screen.getByTestId("login-card")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with email and password", () => {
      const onSubmit = vi.fn();
      render(<LoginForm onSubmit={onSubmit} />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      });
    });

    it("calls onSubmit with rememberMe when checked", () => {
      const onSubmit = vi.fn();
      render(<LoginForm onSubmit={onSubmit} />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Remember me"));
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: true,
      });
    });

    it("does not include rememberMe when showRememberMe is false", () => {
      const onSubmit = vi.fn();
      render(<LoginForm onSubmit={onSubmit} showRememberMe={false} />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("conditional rendering", () => {
    it("renders remember me checkbox by default", () => {
      render(<LoginForm />);
      expect(screen.getByText("Remember me")).toBeInTheDocument();
    });

    it("hides remember me when showRememberMe is false", () => {
      render(<LoginForm showRememberMe={false} />);
      expect(screen.queryByText("Remember me")).not.toBeInTheDocument();
    });

    it("renders forgot password link when forgotPasswordHref provided", () => {
      render(<LoginForm forgotPasswordHref="/forgot" />);
      const link = screen.getByText("Forgot password?");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/forgot");
    });

    it("does not render forgot password link by default", () => {
      render(<LoginForm />);
      expect(screen.queryByText("Forgot password?")).not.toBeInTheDocument();
    });

    it("renders signup link when signupHref provided", () => {
      render(<LoginForm signupHref="/signup" />);
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      const signUpLink = screen.getByText("Sign up");
      expect(signUpLink).toHaveAttribute("href", "/signup");
    });

    it("renders custom signup label", () => {
      render(<LoginForm signupHref="/signup" signupLabel="New here?" />);
      expect(screen.getByText("New here?")).toBeInTheDocument();
    });

    it("does not render signup link by default", () => {
      render(<LoginForm />);
      expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
    });

    it("renders logo when provided", () => {
      render(<LoginForm logo={<div data-testid="logo">Logo</div>} />);
      expect(screen.getByTestId("logo")).toBeInTheDocument();
    });

    it("does not render logo by default", () => {
      const { container } = render(<LoginForm />);
      expect(container.querySelector("[data-testid='logo']")).not.toBeInTheDocument();
    });
  });

  describe("social providers", () => {
    it("renders social provider buttons", () => {
      const onClick = vi.fn();
      render(
        <LoginForm
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
        <LoginForm
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
      render(<LoginForm />);
      expect(screen.queryByText("or")).not.toBeInTheDocument();
    });

    it("calls social provider onClick when clicked", () => {
      const onClick = vi.fn();
      render(
        <LoginForm
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
    it("email input has type email", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    });

    it("password input has type password", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    });

    it("email input is required", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Email")).toBeRequired();
    });

    it("password input is required", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Password")).toBeRequired();
    });
  });

  describe("accessibility", () => {
    it("passes axe accessibility checks", async () => {
      const { container } = render(<LoginForm />);
      await expectNoA11yViolations(container);
    });
  });
});

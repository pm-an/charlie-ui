"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type FormEvent,
} from "react";
import { cn } from "../utils/cn";
import { Input } from "./Input";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";

export interface LoginFormSocialProvider {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}

export type LoginFormProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  onSubmit?: (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => void;
  title?: string;
  description?: string;
  logo?: ReactNode;
  showRememberMe?: boolean;
  forgotPasswordHref?: string;
  signupHref?: string;
  signupLabel?: string;
  socialProviders?: LoginFormSocialProvider[];
};

const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>(
  (
    {
      className,
      onSubmit,
      title = "Welcome back",
      description = "Sign in to your account",
      logo,
      showRememberMe = true,
      forgotPasswordHref,
      signupHref,
      signupLabel = "Don't have an account?",
      socialProviders,
      ...props
    },
    ref
  ) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.({
        email,
        password,
        ...(showRememberMe ? { rememberMe } : {}),
      });
    };

    return (
      <div
        ref={ref}
        data-slot="login-form"
        className={cn(
          "bg-card-gradient rounded-xl border border-white/[0.06] p-8 w-full max-w-md",
          className
        )}
        {...props}
      >
        {logo && (
          <div className="flex justify-center mb-6">{logo}</div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            label="Email"
          />

          <Input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            label="Password"
          />

          {(showRememberMe || forgotPasswordHref) && (
            <div className="flex items-center justify-between">
              {showRememberMe && (
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label="Remember me"
                />
              )}
              {forgotPasswordHref && (
                <a
                  href={forgotPasswordHref}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </a>
              )}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </form>

        {socialProviders && socialProviders.length > 0 && (
          <>
            <div className="flex items-center gap-3 w-full my-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-white/60 shrink-0">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            <div className="space-y-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.name}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={provider.onClick}
                >
                  {provider.icon}
                  Continue with {provider.name}
                </Button>
              ))}
            </div>
          </>
        )}

        {signupHref && (
          <p className="mt-6 text-center text-sm text-white/60">
            {signupLabel}{" "}
            <a
              href={signupHref}
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              Sign up
            </a>
          </p>
        )}
      </div>
    );
  }
);

LoginForm.displayName = "LoginForm";

export { LoginForm };

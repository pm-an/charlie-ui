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

export interface SignupFormSocialProvider {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}

export type SignupFormProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
  }) => void;
  title?: string;
  description?: string;
  logo?: ReactNode;
  loginHref?: string;
  loginLabel?: string;
  showTerms?: boolean;
  termsHref?: string;
  privacyHref?: string;
  socialProviders?: SignupFormSocialProvider[];
};

const SignupForm = forwardRef<HTMLDivElement, SignupFormProps>(
  (
    {
      className,
      onSubmit,
      title = "Create your account",
      description = "Start your free trial today",
      logo,
      loginHref,
      loginLabel = "Already have an account?",
      showTerms = true,
      termsHref = "#",
      privacyHref = "#",
      socialProviders,
      ...props
    },
    ref
  ) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.({ name, email, password });
    };

    return (
      <div
        ref={ref}
        data-slot="signup-form"
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
          <p className="mt-1 text-sm text-white/70">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="signup-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            label="Full name"
          />

          <Input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            label="Email"
          />

          <Input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            label="Password"
            description="Must be at least 8 characters"
          />

          {showTerms && (
            <div className="flex items-start gap-2">
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                className="mt-0.5"
                aria-label="I agree to the Terms of Service and Privacy Policy"
              />
              <span className="text-sm text-white/70">
                I agree to the{" "}
                <a
                  href={termsHref}
                  className="text-white/80 hover:text-white transition-colors duration-200 underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href={privacyHref}
                  className="text-white/80 hover:text-white transition-colors duration-200 underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Create account
          </Button>
        </form>

        {socialProviders && socialProviders.length > 0 && (
          <>
            <div className="flex items-center gap-3 w-full my-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-white/70 shrink-0">or</span>
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

        {loginHref && (
          <p className="mt-6 text-center text-sm text-white/70">
            {loginLabel}{" "}
            <a
              href={loginHref}
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        )}
      </div>
    );
  }
);

SignupForm.displayName = "SignupForm";

export { SignupForm };

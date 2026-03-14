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

export type ForgotPasswordFormProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  onSubmit?: (data: { email: string }) => void;
  title?: string;
  description?: string;
  logo?: ReactNode;
  loginHref?: string;
  loginLabel?: string;
};

const ForgotPasswordForm = forwardRef<HTMLDivElement, ForgotPasswordFormProps>(
  (
    {
      className,
      onSubmit,
      title = "Reset your password",
      description = "Enter your email and we'll send you a reset link",
      logo,
      loginHref,
      loginLabel = "Back to sign in",
      ...props
    },
    ref
  ) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.({ email });
    };

    return (
      <div
        ref={ref}
        data-slot="forgot-password-form"
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
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            label="Email"
          />

          <Button type="submit" variant="primary" className="w-full">
            Send reset link
          </Button>
        </form>

        {loginHref && (
          <p className="mt-6 text-center text-sm text-white/70">
            <a
              href={loginHref}
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              {loginLabel}
            </a>
          </p>
        )}
      </div>
    );
  }
);

ForgotPasswordForm.displayName = "ForgotPasswordForm";

export { ForgotPasswordForm };

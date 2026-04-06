"use client";

import { type FormEvent, useState } from "react";
import { cn } from "../utils/cn";

export interface NewsletterProps {
  title: string;
  description: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function Newsletter({ title, description, onSubmit, className }: NewsletterProps) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim()) {
      onSubmit?.(email.trim());
      setEmail("");
    }
  }

  return (
    <div
      data-slot="newsletter"
      className={cn(
        "bg-card-gradient rounded-xl border border-border p-5 md:p-8 text-center",
        className
      )}
    >
      <h3 className="text-text-loud font-semibold text-xl mb-2">{title}</h3>
      <p className="text-fg-200 text-sm mb-6">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full md:flex-1 bg-bg-subtle border border-border rounded-md h-11 px-3 text-sm text-text-loud placeholder-text-muted outline-none focus:border-border-hover transition-colors"
        />
        <button
          type="submit"
          className="w-full md:w-auto bg-white text-[#18191a] rounded-md h-11 px-4 text-sm font-medium hover:bg-white/90 transition-colors cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

Newsletter.displayName = "Newsletter";

export { Newsletter };

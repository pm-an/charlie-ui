"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type FormEvent,
} from "react";
import { cn } from "../utils/cn";

export type ContactInfo = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactSectionProps = Omit<HTMLAttributes<HTMLElement>, "onSubmit"> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  onSubmit?: (data: ContactFormData) => void;
  info?: ContactInfo[];
  variant?: "simple" | "split";
};

const ContactSection = forwardRef<HTMLElement, ContactSectionProps>(
  (
    {
      className,
      eyebrow,
      title,
      description,
      onSubmit,
      info,
      variant = "split",
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState<ContactFormData>({
      name: "",
      email: "",
      message: "",
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.(formData);
    };

    const handleChange = (
      field: keyof ContactFormData,
      value: string
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const formElement = (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-white/80">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-1 focus:ring-white/15 focus:border-white/15"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-white/80">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-white/5 border border-white/6 rounded-md h-10 px-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-1 focus:ring-white/15 focus:border-white/15"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="text-sm font-medium text-white/80">
            Message
          </label>
          <textarea
            id="contact-message"
            placeholder="How can we help?"
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="w-full bg-white/5 border border-white/6 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:ring-1 focus:ring-white/15 focus:border-white/15 min-h-[80px] resize-vertical"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md px-4 py-2.5 min-h-[44px] text-sm font-medium transition-all duration-200 active:scale-[0.98] bg-white/80 hover:bg-white text-[#18191a]"
        >
          Send message
        </button>
      </form>
    );

    return (
      <section
        ref={ref}
        data-slot="contact-section"
        className={cn("py-12 md:py-20", className)}
        {...props}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {(eyebrow || title || description) && (
            <div className={cn(variant === "simple" && "text-center")}>
              {eyebrow && (
                <p className="text-red text-sm font-medium tracking-wide uppercase mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={cn(
                    "text-white/60 text-base md:text-lg mt-3 md:mt-4 max-w-2xl",
                    variant === "simple" && "mx-auto"
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 md:mt-12">
            {variant === "simple" ? (
              <div className="max-w-lg mx-auto">{formElement}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {info && info.length > 0 && (
                  <div className="space-y-6">
                    {info.map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/60">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/60">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-white hover:text-white/80 transition-colors duration-200"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-white">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div>{formElement}</div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

ContactSection.displayName = "ContactSection";

export { ContactSection };

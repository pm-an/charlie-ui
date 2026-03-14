"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

const announcementBarVariants = cva(
  "w-full py-2.5 px-4 flex items-center justify-center gap-2 relative",
  {
    variants: {
      variant: {
        default: "bg-white/5",
        info: "bg-blue/10",
        warning: "bg-yellow/10",
        success: "bg-green/10",
        brand: "bg-red/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type AnnouncementBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> &
  VariantProps<typeof announcementBarVariants> & {
    message: string | ReactNode;
    href?: string;
    linkText?: string;
    dismissible?: boolean;
    icon?: ReactNode;
    onDismiss?: () => void;
  };

const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(
  (
    {
      className,
      variant,
      message,
      href,
      linkText,
      dismissible = true,
      icon,
      onDismiss,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const messageContent = (
      <span className="text-sm text-white/80">{message}</span>
    );

    return (
      <div
        ref={ref}
        data-slot="announcement-bar"
        className={cn(announcementBarVariants({ variant }), className)}
        role="banner"
        {...props}
      >
        {icon && <span className="flex-shrink-0 text-white/60">{icon}</span>}

        <div className="flex items-center gap-2 min-w-0">
          {href ? (
            <a href={href} className="text-sm text-white/80 hover:text-white transition-colors duration-200">
              {message}
            </a>
          ) : (
            messageContent
          )}

          {linkText && href && (
            <a
              href={href}
              className="text-sm font-medium text-white underline hover:text-white/80 transition-colors duration-200 flex-shrink-0"
            >
              {linkText}
            </a>
          )}

          {linkText && !href && (
            <span className="text-sm font-medium text-white underline flex-shrink-0">
              {linkText}
            </span>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 p-1 text-white/40 hover:text-white transition-colors duration-200 rounded-md hover:bg-white/5"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

AnnouncementBar.displayName = "AnnouncementBar";

export { AnnouncementBar, announcementBarVariants };

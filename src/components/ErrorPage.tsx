import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import {
  AlertTriangle,
  ServerCrash,
  Construction,
  Rocket,
} from "lucide-react";

export type ErrorCode = "404" | "500" | "503" | "maintenance" | "coming-soon";

const errorDefaults: Record<
  ErrorCode,
  { title: string; description: string; icon: ReactNode }
> = {
  "404": {
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist or has been moved.",
    icon: <AlertTriangle className="h-10 w-10" />,
  },
  "500": {
    title: "Server error",
    description: "Something went wrong on our end. Please try again later.",
    icon: <ServerCrash className="h-10 w-10" />,
  },
  "503": {
    title: "Service unavailable",
    description: "We're temporarily offline for maintenance.",
    icon: <ServerCrash className="h-10 w-10" />,
  },
  maintenance: {
    title: "Under maintenance",
    description:
      "We're making some improvements. We'll be back shortly.",
    icon: <Construction className="h-10 w-10" />,
  },
  "coming-soon": {
    title: "Coming soon",
    description: "We're working on something exciting. Stay tuned!",
    icon: <Rocket className="h-10 w-10" />,
  },
};

export type ErrorPageProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  code: ErrorCode;
  title?: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
};

const ErrorPage = forwardRef<HTMLDivElement, ErrorPageProps>(
  ({ className, code, title, description, action, backHref, ...props }, ref) => {
    const defaults = errorDefaults[code];
    const displayTitle = title || defaults.title;
    const displayDescription = description || defaults.description;
    const displayIcon = defaults.icon;
    const isNumericCode = /^\d+$/.test(code);

    return (
      <div
        ref={ref}
        data-slot="error-page"
        className={cn(
          "flex min-h-screen items-center justify-center px-4",
          className
        )}
        {...props}
      >
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            {isNumericCode ? (
              <span className="text-7xl font-bold text-text-muted" aria-hidden="true">{code}</span>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-subtle text-fg-200">
                {displayIcon}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-text-loud">{displayTitle}</h1>

          <p className="mt-2 text-fg-200">{displayDescription}</p>

          {(action || backHref) && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {action}
              {backHref && (
                <a
                  href={backHref}
                  className="inline-flex items-center rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-sm font-medium text-text-loud transition-all duration-200 hover:border-border-hover active:scale-[0.98]"
                >
                  Go home
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ErrorPage.displayName = "ErrorPage";

export { ErrorPage };

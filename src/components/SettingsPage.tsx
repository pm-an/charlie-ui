"use client";

import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

/* ─── Context ───────────────────────────────── */

type SettingsContextValue = {
  activeSection?: string;
  onSectionChange?: (id: string) => void;
};

const SettingsContext = createContext<SettingsContextValue>({});

/* ─── SettingsPage Root ─────────────────────── */

export type SettingsSectionItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

export type SettingsPageProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  sections?: SettingsSectionItem[];
  activeSection?: string;
  onSectionChange?: (id: string) => void;
};

const SettingsPageRoot = forwardRef<HTMLDivElement, SettingsPageProps>(
  (
    {
      className,
      title = "Settings",
      description,
      sections = [],
      activeSection,
      onSectionChange,
      children,
      ...props
    },
    ref
  ) => {
    const handleSectionClick = (id: string) => {
      onSectionChange?.(id);
      const el = document.getElementById(`settings-section-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
      <SettingsContext.Provider value={{ activeSection, onSectionChange }}>
        <div
          ref={ref}
          data-slot="settings-page"
          className={cn("min-h-screen bg-[#0a0a0b]", className)}
          {...props}
        >
          {/* Page header */}
          <div
            data-slot="settings-page-header"
            className="border-b border-white/[0.06] px-6 py-8"
          >
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-white/70">{description}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Side navigation */}
            {sections.length > 0 && (
              <nav
                data-slot="settings-page-nav"
                aria-label="Settings navigation"
                className={cn(
                  // Mobile: horizontal scroll tabs
                  "flex md:flex-col",
                  "overflow-x-auto md:overflow-x-visible",
                  "border-b md:border-b-0 md:border-r border-white/[0.06]",
                  "w-full md:w-48 shrink-0",
                  "px-2 md:px-0 md:py-4"
                )}
              >
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    data-slot="settings-page-nav-item"
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-colors",
                      "rounded-md md:rounded-none md:rounded-r-md",
                      activeSection === section.id
                        ? "text-white bg-white/5 font-medium md:border-l-2 md:border-accent"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {section.icon && (
                      <span className="h-4 w-4 shrink-0 flex items-center justify-center">
                        {section.icon}
                      </span>
                    )}
                    <span>{section.label}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* Content area */}
            <div
              data-slot="settings-page-content"
              className="flex-1 px-6 py-6 md:py-8"
            >
              {children}
            </div>
          </div>
        </div>
      </SettingsContext.Provider>
    );
  }
);
SettingsPageRoot.displayName = "SettingsPage";

/* ─── SettingsPage.Section ──────────────────── */

export type SettingsSectionProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  title: string;
  description?: string;
};

const SettingsSection = forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ className, id, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={`settings-section-${id}`}
        data-slot="settings-section"
        className={cn(
          "border-b border-white/[0.06] pb-8 mb-8 last:border-b-0 last:mb-0",
          className
        )}
        {...props}
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-white/70">{description}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    );
  }
);
SettingsSection.displayName = "SettingsPage.Section";

/* ─── Compound Export ───────────────────────── */

const SettingsPage = Object.assign(SettingsPageRoot, {
  Section: SettingsSection,
});

export { SettingsPage };

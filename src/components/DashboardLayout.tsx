"use client";

import {
  createContext,
  useContext,
  useCallback,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";

/* ─── Context ───────────────────────────────── */

type DashboardContextValue = {
  sidebarCollapsed: boolean;
  onSidebarToggle?: () => void;
};

const DashboardContext = createContext<DashboardContextValue>({
  sidebarCollapsed: false,
});

function useDashboard() {
  return useContext(DashboardContext);
}

/* ─── DashboardLayout Root ──────────────────── */

export type DashboardLayoutProps = HTMLAttributes<HTMLDivElement> & {
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
};

const DashboardLayoutRoot = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      className,
      sidebarCollapsed = false,
      onSidebarToggle,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <DashboardContext.Provider value={{ sidebarCollapsed, onSidebarToggle }}>
        <div
          ref={ref}
          data-slot="dashboard-layout"
          className={cn("flex min-h-screen", className)}
          {...props}
        >
          {children}
        </div>
      </DashboardContext.Provider>
    );
  }
);
DashboardLayoutRoot.displayName = "DashboardLayout";

/* ─── DashboardLayout.Sidebar ───────────────── */

export type DashboardSidebarProps = HTMLAttributes<HTMLElement> & {
  logo?: ReactNode;
  footer?: ReactNode;
};

const DashboardSidebar = forwardRef<HTMLElement, DashboardSidebarProps>(
  ({ className, logo, footer, children, ...props }, ref) => {
    const { sidebarCollapsed, onSidebarToggle } = useDashboard();

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!onSidebarToggle) return;
        if (e.key === "ArrowLeft" && !sidebarCollapsed) {
          e.preventDefault();
          onSidebarToggle();
        } else if (e.key === "ArrowRight" && sidebarCollapsed) {
          e.preventDefault();
          onSidebarToggle();
        }
      },
      [sidebarCollapsed, onSidebarToggle]
    );

    return (
      <>
        {/* Desktop sidebar */}
        <motion.aside
          ref={ref}
          data-slot="dashboard-sidebar"
          aria-label="Sidebar navigation"
          animate={{ width: sidebarCollapsed ? 64 : 256 }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
          onKeyDown={handleKeyDown}
          className={cn(
            "hidden md:flex flex-col border-r border-white/[0.06] bg-[#0a0a0b] overflow-hidden shrink-0",
            className
          )}
          {...(props as Record<string, unknown>)}
        >
          {logo && (
            <div
              data-slot="dashboard-sidebar-logo"
              className={cn(
                "h-14 flex items-center border-b border-white/[0.06] px-4",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              {logo}
            </div>
          )}
          <div className="flex-1 overflow-y-auto py-4">{children}</div>
          {footer && (
            <div
              data-slot="dashboard-sidebar-footer"
              className="border-t border-white/[0.06] p-4"
            >
              {footer}
            </div>
          )}
        </motion.aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <>
              <motion.div
                data-slot="dashboard-sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26 }}
                className="md:hidden fixed inset-0 bg-black/60 z-40"
                onClick={onSidebarToggle}
              />
              <motion.aside
                data-slot="dashboard-sidebar-mobile"
                aria-label="Sidebar navigation"
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ duration: 0.26, ease: "easeInOut" }}
                className={cn(
                  "md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#0a0a0b] border-r border-white/[0.06]",
                  className
                )}
              >
                {logo && (
                  <div className="h-14 flex items-center border-b border-white/[0.06] px-4">
                    {logo}
                  </div>
                )}
                <div className="flex-1 overflow-y-auto py-4">{children}</div>
                {footer && (
                  <div className="border-t border-white/[0.06] p-4">
                    {footer}
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
);
DashboardSidebar.displayName = "DashboardLayout.Sidebar";

/* ─── DashboardLayout.Header ────────────────── */

export type DashboardHeaderProps = HTMLAttributes<HTMLElement>;

const DashboardHeader = forwardRef<HTMLElement, DashboardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        data-slot="dashboard-header"
        className={cn(
          "h-14 border-b border-white/[0.06] bg-[#0a0a0b] px-4 flex items-center shrink-0",
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);
DashboardHeader.displayName = "DashboardLayout.Header";

/* ─── DashboardLayout.Content ───────────────── */

export type DashboardContentProps = HTMLAttributes<HTMLDivElement>;

const DashboardContent = forwardRef<HTMLDivElement, DashboardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        data-slot="dashboard-content"
        className={cn("flex-1 p-6 overflow-auto", className)}
        {...props}
      >
        {children}
      </main>
    );
  }
);
DashboardContent.displayName = "DashboardLayout.Content";

/* ─── Compound Export ───────────────────────── */

const DashboardLayout = Object.assign(DashboardLayoutRoot, {
  Sidebar: DashboardSidebar,
  Header: DashboardHeader,
  Content: DashboardContent,
});

export { DashboardLayout };

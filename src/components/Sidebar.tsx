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
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

/* ─── Context ───────────────────────────────── */

type SidebarContextValue = {
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
});

function useSidebar() {
  return useContext(SidebarContext);
}

/* ─── Sidebar Root ──────────────────────────── */

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
  side?: "left" | "right";
};

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      className,
      collapsed = false,
      onCollapsedChange,
      width = 260,
      collapsedWidth = 68,
      side = "left",
      children,
      ...props
    },
    ref
  ) => {
    const currentWidth = collapsed ? collapsedWidth : width;

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!onCollapsedChange) return;
        if (e.key === "ArrowLeft" && !collapsed) {
          e.preventDefault();
          onCollapsedChange(true);
        } else if (e.key === "ArrowRight" && collapsed) {
          e.preventDefault();
          onCollapsedChange(false);
        }
      },
      [collapsed, onCollapsedChange]
    );

    return (
      <SidebarContext.Provider value={{ collapsed, onCollapsedChange }}>
        <motion.nav
          ref={ref}
          data-slot="sidebar"
          aria-label="Sidebar navigation"
          animate={{ width: currentWidth }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
          onKeyDown={handleKeyDown}
          className={cn(
            "fixed top-0 h-screen z-40 flex flex-col bg-bg-100 overflow-hidden",
            side === "left"
              ? "left-0 border-r border-white/6"
              : "right-0 border-l border-white/6",
            className
          )}
          {...(props as Record<string, unknown>)}
        >
          {children}
        </motion.nav>
      </SidebarContext.Provider>
    );
  }
);
SidebarRoot.displayName = "Sidebar";

/* ─── Sidebar.Header ───────────────────────── */

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-4 border-b border-white/6",
          collapsed && "flex items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarHeader.displayName = "Sidebar.Header";

/* ─── Sidebar.Content ──────────────────────── */

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto py-2",
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-white/10",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarContent.displayName = "Sidebar.Content";

/* ─── Sidebar.Footer ───────────────────────── */

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-4 py-4 border-t border-white/6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarFooter.displayName = "Sidebar.Footer";

/* ─── Sidebar.Group ────────────────────────── */

export type SidebarGroupProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { collapsed } = useSidebar();

    return (
      <div ref={ref} className={cn("px-3 py-2", className)} {...props}>
        {label && !collapsed && (
          <div className="text-xs font-medium text-white/70 uppercase tracking-wider px-3 mb-1">
            {label}
          </div>
        )}
        {children}
      </div>
    );
  }
);
SidebarGroup.displayName = "Sidebar.Group";

/* ─── Sidebar.Item ─────────────────────────── */

export type SidebarItemProps = HTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  badge?: string | number;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
};

const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      className,
      icon,
      label,
      active = false,
      badge,
      disabled = false,
      href,
      onClick,
      ...props
    },
    ref
  ) => {
    const { collapsed } = useSidebar();

    const itemClasses = cn(
      "flex items-center gap-3 px-3 py-2 text-sm transition-colors w-full",
      active
        ? "bg-white/5 text-white font-medium border-l-2 border-accent rounded-r-md"
        : "text-white/70 hover:bg-white/5 hover:text-white rounded-md",
      disabled && "opacity-40 cursor-not-allowed pointer-events-none",
      collapsed && "justify-center px-0",
      className
    );

    const content = (
      <>
        {icon && (
          <span className="h-5 w-5 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        {!collapsed && <span className="truncate">{label}</span>}
        {!collapsed && badge !== undefined && badge !== null && (
          <span className="ml-auto text-xs bg-accent text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {badge}
          </span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          href={href}
          className={itemClasses}
          aria-current={active ? "page" : undefined}
          title={collapsed ? label : undefined}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={itemClasses}
        aria-current={active ? "page" : undefined}
        disabled={disabled}
        title={collapsed ? label : undefined}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);
SidebarItem.displayName = "Sidebar.Item";

/* ─── Sidebar.Separator ────────────────────── */

export type SidebarSeparatorProps = HTMLAttributes<HTMLDivElement>;

const SidebarSeparator = forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn("h-px mx-3 my-2 bg-white/6", className)}
        {...props}
      />
    );
  }
);
SidebarSeparator.displayName = "Sidebar.Separator";

/* ─── Compound Export ──────────────────────── */

const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Item: SidebarItem,
  Separator: SidebarSeparator,
});

export { Sidebar };

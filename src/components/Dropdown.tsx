"use client";

/**
 * @deprecated Use `DropdownMenu` instead. This component is a backward-compatible
 * wrapper around DropdownMenu and will be removed in a future major version.
 *
 * Migration guide:
 *   Dropdown        → DropdownMenu
 *   Dropdown.Trigger → DropdownMenu.Trigger
 *   Dropdown.Menu   → DropdownMenu.Content
 *   Dropdown.Item   → DropdownMenu.Item
 *   Dropdown.Separator → DropdownMenu.Separator
 *   Dropdown.Label  → DropdownMenu.Label
 */

import {
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { type LucideProps } from "lucide-react";
import { cn } from "../utils/cn";
import {
  DropdownMenu,
  useMenuClose,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./DropdownMenu";

/* ─── Dropdown Root ─────────────────────── */

export type DropdownProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function DropdownRoot({ className, children, ...props }: DropdownProps) {
  return (
    <DropdownMenu>
      <div
        data-slot="dropdown"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </DropdownMenu>
  );
}

DropdownRoot.displayName = "Dropdown";

/* ─── Dropdown.Trigger ──────────────────── */

export type DropdownTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

function DropdownTrigger({
  children,
  className,
  asChild = false,
}: DropdownTriggerProps) {
  return (
    <DropdownMenu.Trigger className={cn("cursor-pointer", className)} asChild={asChild}>
      {children}
    </DropdownMenu.Trigger>
  );
}

DropdownTrigger.displayName = "Dropdown.Trigger";

/* ─── Dropdown.Menu ─────────────────────── */

/** @deprecated Renamed to avoid collision with DropdownMenuProps from DropdownMenu. Use DropdownMenuContentProps instead. */
export type DropdownMenuPanelProps = {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "bottom" | "top";
};

function DropdownMenuPanel({
  children,
  className,
  align = "start",
  side: _side = "bottom",
}: DropdownMenuPanelProps) {
  // Note: The "side" prop is accepted for backward compat but DropdownMenu.Content
  // only supports bottom positioning. The prop is retained to avoid breaking callers.
  return (
    <DropdownMenu.Content className={className} align={align}>
      {children}
    </DropdownMenu.Content>
  );
}

DropdownMenuPanel.displayName = "Dropdown.Menu";

/* ─── Dropdown.Item ─────────────────────── */

export type DropdownItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: React.ComponentType<LucideProps>;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

function DropdownItem({
  className,
  icon: Icon,
  onSelect,
  disabled = false,
  destructive = false,
  children,
  ...props
}: DropdownItemProps) {
  const { close } = useMenuClose();

  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelect?.();
    close();
  }, [disabled, onSelect, close]);

  return (
    <div
      role="menuitem"
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
        destructive
          ? "text-red hover:bg-red-muted"
          : "text-fg-200 hover:bg-bg-subtle",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={handleClick}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </div>
  );
}

DropdownItem.displayName = "Dropdown.Item";

/* ─── Dropdown.Separator ────────────────── */

function DropdownSeparator() {
  return <DropdownMenuSeparator className="h-px bg-bg-subtle my-1 mx-2" />;
}

DropdownSeparator.displayName = "Dropdown.Separator";

/* ─── Dropdown.Label ────────────────────── */

export type DropdownLabelProps = {
  children: ReactNode;
  className?: string;
};

function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <DropdownMenuLabel
      className={cn(
        "px-3 py-2 text-xs font-medium uppercase tracking-wider text-fg-200",
        className
      )}
    >
      {children}
    </DropdownMenuLabel>
  );
}

DropdownLabel.displayName = "Dropdown.Label";

/* ─── Compound Export ───────────────────── */

const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenuPanel,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  Label: DropdownLabel,
});

export { Dropdown };

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Slot } from "../utils/Slot";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { useControllableState } from "../hooks/useControllableState";

/* ─── Shared Menu Close Context ─────────────────── */
// Shared between DropdownMenu and ContextMenu so that
// sub-components (Item, CheckboxItem, etc.) can be defined once.

type MenuCloseContextValue = {
  close: () => void;
};

const MenuCloseContext = createContext<MenuCloseContextValue | null>(null);

function useMenuClose() {
  const ctx = useContext(MenuCloseContext);
  if (!ctx) throw new Error("Menu sub-components must be used within a DropdownMenu or ContextMenu");
  return ctx;
}

/* ─── Shared Radio Group Context ────────────────── */

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  return useContext(RadioGroupContext);
}

/* ─── Types ──────────────────────────────────── */

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  itemCount: number;
  registerItem: () => number;
  close: () => void;
};

/* ─── DropdownMenu Internal Context ─────────────── */

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu compound components must be used within a DropdownMenu");
  return ctx;
}

/* ─── DropdownMenu Root ──────────────────────── */

export type DropdownMenuProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DropdownMenuRoot = ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DropdownMenuProps) => {
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const itemCountRef = useRef(0);

  // Reset item count on each render cycle
  useEffect(() => {
    if (!open) {
      itemCountRef.current = 0;
      setHighlightedIndex(-1);
    }
  }, [open]);

  const registerItem = useCallback(() => {
    return itemCountRef.current++;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      highlightedIndex,
      setHighlightedIndex,
      // eslint-disable-next-line react-hooks/refs -- intentional: counter tracked via ref for item registration
      itemCount: itemCountRef.current,
      registerItem,
      close,
    }),
    [open, setOpen, highlightedIndex, setHighlightedIndex, registerItem, close]
  );

  const closeValue = useMemo(() => ({ close }), [close]);

  return (
    // eslint-disable-next-line react-hooks/refs -- value contains itemCount from ref; intentional pattern for item registration
    <DropdownMenuContext.Provider value={value}>
      <MenuCloseContext.Provider value={closeValue}>
        <div data-slot="dropdown-menu" className="relative inline-block">{children}</div>
      </MenuCloseContext.Provider>
    </DropdownMenuContext.Provider>
  );
};
DropdownMenuRoot.displayName = "DropdownMenu";

/* ─── Trigger ────────────────────────────────── */

export type DropdownMenuTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  asChild?: boolean;
};

const DropdownMenuTrigger = ({ children, className, asChild, ...props }: DropdownMenuTriggerProps) => {
  const { open, setOpen } = useDropdownMenu();

  const sharedProps = {
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    className: cn("cursor-pointer", className),
    onClick: () => setOpen(!open),
    ...props,
  };

  if (asChild) {
    return (
      <Slot {...sharedProps}>
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button type="button" {...sharedProps}>
      {children}
    </button>
  );
};
DropdownMenuTrigger.displayName = "DropdownMenu.Trigger";

/* ─── Content ────────────────────────────────── */

export type DropdownMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: "start" | "center" | "end";
};

const DropdownMenuContent = ({ children, className, align = "start" }: DropdownMenuContentProps) => {
  const { open, close, setHighlightedIndex } = useDropdownMenu();
  const contentRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.closest(".relative")?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, close]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const content = contentRef.current;
      if (!content) return;

      const items = Array.from(
        content.querySelectorAll<HTMLElement>('[data-menu-item]:not([data-disabled="true"])')
      );
      const itemCount = items.length;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev: number) => {
          const next = prev < itemCount - 1 ? prev + 1 : 0;
          items[next]?.focus();
          return next;
        });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev: number) => {
          const next = prev > 0 ? prev - 1 : itemCount - 1;
          items[next]?.focus();
          return next;
        });
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const focused = document.activeElement as HTMLElement;
        if (focused?.dataset?.menuItem !== undefined) {
          focused.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close, setHighlightedIndex]);

  const alignClass = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }[align];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          role="menu"
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute top-full mt-1 z-50 min-w-[180px] rounded-lg border border-white/10 bg-[var(--charlie-bg-200,#1a1a1a)] p-1 shadow-xl",
            alignClass,
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
DropdownMenuContent.displayName = "DropdownMenu.Content";

/* ─── Shared Sub-components ─────────────────────── */
// These sub-components use MenuCloseContext so they work in both
// DropdownMenu and ContextMenu without code duplication.

/* ─── Item ───────────────────────────────────── */

export type DropdownMenuItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
};

const DropdownMenuItem = ({
  children,
  className,
  icon,
  shortcut,
  disabled = false,
  destructive = false,
  onSelect,
  onClick,
  ...props
}: DropdownMenuItemProps) => {
  const { close } = useMenuClose();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onSelect?.();
    onClick?.(e);
    close();
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      data-menu-item=""
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer",
        destructive
          ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
          : "text-white/80 hover:bg-white/5 focus:bg-white/5",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="h-4 w-4 shrink-0 text-white/70 flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </div>
  );
};
DropdownMenuItem.displayName = "DropdownMenu.Item";

/* ─── CheckboxItem ───────────────────────────── */

export type DropdownMenuCheckboxItemProps = Omit<DropdownMenuItemProps, "icon"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const DropdownMenuCheckboxItem = ({
  children,
  className,
  checked = false,
  onCheckedChange,
  shortcut,
  disabled = false,
  onSelect,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  const { close } = useMenuClose();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onCheckedChange?.(!checked);
    onSelect?.();
    onClick?.(e);
    close();
  };

  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      data-menu-item=""
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white/80 outline-none transition-colors cursor-pointer hover:bg-white/5 focus:bg-white/5",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {checked && <Check className="h-4 w-4 text-white/80" />}
      </span>
      <span className="flex-1">{children}</span>
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </div>
  );
};
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

/* ─── RadioGroup ─────────────────────────────── */

export type DropdownMenuRadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
};

const DropdownMenuRadioGroup = ({ value, onValueChange, children }: DropdownMenuRadioGroupProps) => {
  const ctx = useMemo(() => ({ value, onValueChange }), [value, onValueChange]);

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
};
DropdownMenuRadioGroup.displayName = "DropdownMenu.RadioGroup";

/* ─── RadioItem ──────────────────────────────── */

export type DropdownMenuRadioItemProps = Omit<DropdownMenuItemProps, "icon"> & {
  value: string;
};

const DropdownMenuRadioItem = ({
  children,
  className,
  value,
  shortcut,
  disabled = false,
  onSelect,
  onClick,
  ...props
}: DropdownMenuRadioItemProps) => {
  const { close } = useMenuClose();
  const radioGroup = useRadioGroup();
  const isSelected = radioGroup?.value === value;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    radioGroup?.onValueChange?.(value);
    onSelect?.();
    onClick?.(e);
    close();
  };

  return (
    <div
      role="menuitemradio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      data-menu-item=""
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white/80 outline-none transition-colors cursor-pointer hover:bg-white/5 focus:bg-white/5",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {isSelected && <Circle className="h-2 w-2 fill-white/80 text-white/80" />}
      </span>
      <span className="flex-1">{children}</span>
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </div>
  );
};
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";

/* ─── Label ──────────────────────────────────── */

export type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const DropdownMenuLabel = ({ children, className, ...props }: DropdownMenuLabelProps) => {
  return (
    <div
      className={cn("select-none px-2 py-1.5 text-xs font-medium text-white/70", className)}
      {...props}
    >
      {children}
    </div>
  );
};
DropdownMenuLabel.displayName = "DropdownMenu.Label";

/* ─── Separator ──────────────────────────────── */

export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-white/6", className)}
      {...props}
    />
  );
};
DropdownMenuSeparator.displayName = "DropdownMenu.Separator";

/* ─── Shortcut ───────────────────────────────── */

export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

const DropdownMenuShortcut = ({ children, className, ...props }: DropdownMenuShortcutProps) => {
  return (
    <span className={cn("ml-auto text-xs text-white/70", className)} {...props}>
      {children}
    </span>
  );
};
DropdownMenuShortcut.displayName = "DropdownMenu.Shortcut";

/* ─── Compound Export ────────────────────────── */

const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
});

export { DropdownMenu };

/* ─── Shared exports for ContextMenu and Dropdown ── */
// Internal exports used by sibling menu components
// to avoid duplicating sub-component code.

export {
  MenuCloseContext,
  RadioGroupContext,
  useMenuClose,
  useRadioGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};

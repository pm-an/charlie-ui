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
import { AnimatePresence, motion } from "framer-motion";

// Reuse shared sub-components from DropdownMenu
import {
  MenuCloseContext,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./DropdownMenu";

// Re-export types for backward compatibility
export type {
  DropdownMenuItemProps as ContextMenuItemProps,
  DropdownMenuCheckboxItemProps as ContextMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps as ContextMenuRadioGroupProps,
  DropdownMenuRadioItemProps as ContextMenuRadioItemProps,
  DropdownMenuLabelProps as ContextMenuLabelProps,
  DropdownMenuSeparatorProps as ContextMenuSeparatorProps,
  DropdownMenuShortcutProps as ContextMenuShortcutProps,
} from "./DropdownMenu";

/* ─── Types ──────────────────────────────────── */

type ContextMenuContextValue = {
  open: boolean;
  position: { x: number; y: number };
  close: () => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  handleContextMenu: (e: React.MouseEvent) => void;
};

/* ─── Context ───────────────────────────────── */

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu compound components must be used within a ContextMenu");
  return ctx;
}

/* ─── ContextMenu Root ───────────────────────── */

export type ContextMenuProps = {
  children: ReactNode;
};

const ContextMenuRoot = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const value = useMemo(
    () => ({ open, position, close, highlightedIndex, setHighlightedIndex, handleContextMenu }),
    [open, position, close, highlightedIndex, handleContextMenu]
  );

  const closeValue = useMemo(() => ({ close }), [close]);

  return (
    <ContextMenuContext.Provider value={value}>
      <MenuCloseContext.Provider value={closeValue}>
        <div data-slot="context-menu">{children}</div>
      </MenuCloseContext.Provider>
    </ContextMenuContext.Provider>
  );
};
ContextMenuRoot.displayName = "ContextMenu";

/* ─── Trigger ────────────────────────────────── */

export type ContextMenuTriggerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const ContextMenuTrigger = ({ children, className, ...props }: ContextMenuTriggerProps) => {
  const { handleContextMenu } = useContextMenu();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Shift+F10 opens context menu (standard Windows/Linux keyboard shortcut)
      if (e.key === "F10" && e.shiftKey) {
        e.preventDefault();
        // Synthesize a context menu event at the element's position
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const syntheticEvent = {
          preventDefault: () => {},
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        } as React.MouseEvent;
        handleContextMenu(syntheticEvent);
      }
    },
    [handleContextMenu]
  );

  return (
    <div
      className={className}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={props.tabIndex ?? 0}
      {...props}
    >
      {children}
    </div>
  );
};
ContextMenuTrigger.displayName = "ContextMenu.Trigger";

/* ─── Content ────────────────────────────────── */

export type ContextMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const ContextMenuContent = ({ children, className }: ContextMenuContentProps) => {
  const { open, position, close, setHighlightedIndex } = useContextMenu();
  const contentRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          role="menu"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ position: "fixed", top: position.y, left: position.x }}
          className={cn(
            "z-50 min-w-[180px] rounded-lg border border-white/10 bg-[var(--charlie-bg-200,#1a1a1a)] p-1 shadow-xl",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
ContextMenuContent.displayName = "ContextMenu.Content";

/* ─── Compound Export ────────────────────────── */
// Sub-components (Item, CheckboxItem, RadioGroup, RadioItem, Label,
// Separator, Shortcut) are reused directly from DropdownMenu.

const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
});

export { ContextMenu };

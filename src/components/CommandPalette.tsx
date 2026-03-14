"use client";

import {
  type ReactNode,
  type HTMLAttributes,
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  Children,
  isValidElement,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, type LucideProps } from "lucide-react";
import { cn } from "../utils/cn";
import { Spinner } from "./Spinner";

/* ---- Context ---- */

type CommandPaletteContextValue = {
  search: string;
  activeIndex: number;
  registerItem: () => number;
  itemCount: number;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  search: "",
  activeIndex: -2,
  registerItem: () => -1,
  itemCount: 0,
});

function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

/* ---- CommandPalette (root) ---- */

export type CommandPaletteProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: ReactNode;

  /** Called when the search input value changes */
  onSearch?: (query: string) => void;
  /** Controlled search value */
  search?: string;
  /** Show a loading spinner in the input area */
  loading?: boolean;
  /** Content shown when search yields no results */
  emptyMessage?: ReactNode;
  /** Filter items client-side based on search (default true). Set false for server-side filtering. */
  filter?: boolean;
};

function CommandPalette({
  className,
  open,
  onOpenChange,
  placeholder = "Search...",
  children,
  onSearch,
  search: controlledSearch,
  loading = false,
  emptyMessage = "No results found.",
  filter = true,
  ...props
}: CommandPaletteProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const search = controlledSearch ?? internalSearch;
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemCountRef = useRef(0);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      if (controlledSearch === undefined) setInternalSearch("");
      setActiveIndex(0);
      itemCountRef.current = 0;
    }
  }, [open, controlledSearch]);

  const handleSearchChange = (value: string) => {
    if (controlledSearch === undefined) setInternalSearch(value);
    onSearch?.(value);
    setActiveIndex(0);
    itemCountRef.current = 0;
  };

  // Count visible items for keyboard navigation
  const registerItem = useCallback(() => {
    const idx = itemCountRef.current;
    itemCountRef.current += 1;
    return idx;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const max = itemCountRef.current - 1;
          return max >= 0 ? Math.min(prev + 1, max) : 0;
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        // Fire click on active item
        const activeEl = document.querySelector(
          '[data-slot="command-palette"] [data-command-item][data-active="true"]'
        ) as HTMLElement | null;
        activeEl?.click();
      }
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  // Reset item counter before each render of children
  // eslint-disable-next-line react-hooks/refs -- intentional: counter must reset before children call registerItem
  itemCountRef.current = 0;

  return (
    <AnimatePresence>
      {open && (
        <CommandPaletteContext.Provider
          // eslint-disable-next-line react-hooks/refs -- intentional: reading counter that children populate during render
          value={{ search: filter ? search : "", activeIndex, registerItem, itemCount: itemCountRef.current }}
        >
          <div
            className={cn(
              "fixed inset-0 z-50 flex items-start justify-center pt-[10vh] md:pt-[20vh]",
              className
            )}
            {...props}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <motion.div
              data-slot="command-palette"
              className="relative w-[calc(100%-32px)] md:w-full max-w-[640px] overflow-hidden rounded-xl border border-white/[0.06] bg-grey-700 shadow-window"
              data-state={open ? "open" : "closed"}
              initial={{ opacity: 1, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-label="Command palette"
            >
              {/* Search Input */}
              <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
                {loading ? (
                  <Spinner size="sm" color="rgba(255,255,255,0.4)" />
                ) : (
                  <Search className="h-5 w-5 shrink-0 text-white/70" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-full flex-1 bg-transparent text-base text-white placeholder:text-white/70 outline-none"
                  autoFocus
                  role="combobox"
                  aria-expanded={true}
                  aria-autocomplete="list"
                  aria-controls="command-palette-listbox"
                  aria-label={placeholder ?? "Search commands"}
                />
              </div>

              {/* Results */}
              <div id="command-palette-listbox" className="max-h-[360px] overflow-y-auto py-2" role="listbox" aria-label="Results">
                {children}
                {filter && search && !hasVisibleChildren(children, search) && (
                  <div className="px-4 py-8 text-center text-sm text-white/70">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </CommandPaletteContext.Provider>
      )}
    </AnimatePresence>
  );
}

/** Check if any CommandItem children match the search filter */
function hasVisibleChildren(children: ReactNode, search: string): boolean {
  let hasVisible = false;
  const lowerSearch = search.toLowerCase();

  function walk(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (hasVisible) return;
      if (!isValidElement(child)) return;

      // Check CommandItem keywords/children text
      const props = child.props as Record<string, unknown>;
      if (props["data-command-item"] !== undefined || (child.type as { displayName?: string })?.displayName === "CommandItem") {
        const keywords = (props.keywords as string[]) || [];
        const text = extractText(props.children as ReactNode);
        const label = (props.label as string) || "";
        const searchable = [text, label, ...keywords].join(" ").toLowerCase();
        if (searchable.includes(lowerSearch)) {
          hasVisible = true;
        }
      }

      // Recurse into groups
      if (props.children) {
        walk(props.children as ReactNode);
      }
    });
  }

  walk(children);
  return hasVisible;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (isValidElement(node) && (node.props as Record<string, unknown>).children) {
    return extractText((node.props as Record<string, unknown>).children as ReactNode);
  }
  return "";
}

CommandPalette.displayName = "CommandPalette";

/* ---- CommandGroup ---- */

export type CommandGroupProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

function CommandGroup({ className, label, children, ...props }: CommandGroupProps) {
  return (
    <div className={cn("", className)} {...props}>
      {label && (
        <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/70">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

CommandGroup.displayName = "CommandGroup";

/* ---- CommandItem ---- */

export type CommandItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: React.ComponentType<LucideProps>;
  active?: boolean;
  onSelect?: () => void;
  /** Extra search terms that aren't visible in the UI */
  keywords?: string[];
  /** Shortcut hint displayed on the right */
  shortcut?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
};

function CommandItem({
  className,
  icon: Icon,
  active: activeProp,
  onSelect,
  children,
  keywords = [],
  shortcut,
  disabled = false,
  ...props
}: CommandItemProps) {
  const { search, activeIndex, registerItem } = useCommandPalette();
  const itemIndex = registerItem();

  // Client-side filtering: hide items that don't match search
  if (search) {
    const text = extractText(children);
    const searchable = [text, ...keywords].join(" ").toLowerCase();
    if (!searchable.includes(search.toLowerCase())) {
      return null;
    }
  }

  const isKeyboardActive = activeIndex === itemIndex;
  const isActive = activeProp ?? isKeyboardActive;

  return (
    <div
      data-command-item=""
      data-active={isActive}
      className={cn(
        "mx-2 flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-4 text-sm text-white/80 transition-colors",
        isActive ? "bg-white/5" : "hover:bg-white/5",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      onClick={() => { if (!disabled) onSelect?.(); }}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-white/70" />}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-white/70 shrink-0">{shortcut}</span>
      )}
    </div>
  );
}

CommandItem.displayName = "CommandItem";

export { CommandPalette, CommandGroup, CommandItem };

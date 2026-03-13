import {
  type ReactNode,
  type HTMLAttributes,
  useEffect,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, type LucideProps } from "lucide-react";
import { cn } from "../utils/cn";

/* ---- CommandPalette (root) ---- */

export type CommandPaletteProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: ReactNode;
};

function CommandPalette({
  className,
  open,
  onOpenChange,
  placeholder = "Search...",
  children,
  ...props
}: CommandPaletteProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-[calc(100%-32px)] md:w-full max-w-[640px] overflow-hidden rounded-xl border border-white/[0.06] bg-grey-700 shadow-window"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* Search Input */}
            <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
              <Search className="h-5 w-5 shrink-0 text-white/40" />
              <input
                type="text"
                placeholder={placeholder}
                className="h-full flex-1 bg-transparent text-base text-white placeholder:text-white/40 outline-none"
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto py-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
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
        <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/40">
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
};

function CommandItem({
  className,
  icon: Icon,
  active = false,
  onSelect,
  children,
  ...props
}: CommandItemProps) {
  return (
    <div
      className={cn(
        "mx-2 flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-4 text-sm text-white/80 transition-colors",
        active ? "bg-white/5" : "hover:bg-white/5",
        className
      )}
      onClick={onSelect}
      role="option"
      aria-selected={active}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-white/40" />}
      {children}
    </div>
  );
}

CommandItem.displayName = "CommandItem";

export { CommandPalette, CommandGroup, CommandItem };

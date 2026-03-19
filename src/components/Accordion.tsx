"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useControllableState } from "../hooks/useControllableState";

/* ─── Context ───────────────────────────────── */

type AccordionContextValue = {
  openItems: string[];
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within an Accordion");
  return ctx;
}

/* ─── Accordion Root ────────────────────────── */

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  mode?: "single" | "multiple";
  defaultOpen?: string[];
  /** Controlled open items */
  value?: string[];
  /** Called when open items change (controlled mode) */
  onValueChange?: (value: string[]) => void;
};

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, mode = "single", defaultOpen = [], value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [openItems, setOpenItems] = useControllableState<string[]>(
      controlledValue,
      defaultOpen,
      onValueChange
    );

    const toggle = useCallback(
      (id: string) => {
        setOpenItems((prev) => {
          const isOpen = prev.includes(id);
          if (isOpen) {
            return prev.filter((item) => item !== id);
          } else {
            if (mode === "single") {
              return [id];
            }
            return [...prev, id];
          }
        });
      },
      [mode, setOpenItems]
    );

    const contextValue = useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("space-y-0", className)} data-slot="accordion" {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
AccordionRoot.displayName = "Accordion";

/* ─── AccordionItem ─────────────────────────── */

export type AccordionItemProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> & {
  value: string;
  title: ReactNode;
};

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, title, children, ...props }, ref) => {
    const { openItems, toggle } = useAccordion();
    const isOpen = openItems.includes(value);
    const generatedId = useId();
    const triggerId = `accordion-trigger-${generatedId}`;
    const contentId = `accordion-content-${generatedId}`;

    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-solid border-white/[0.06]",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        data-slot="accordion-item"
        {...props}
      >
        <button
          type="button"
          id={triggerId}
          onClick={() => toggle(value)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          data-slot="accordion-trigger"
          className="flex w-full cursor-pointer items-center justify-between py-4 md:py-5 min-h-[44px] text-left hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-sm md:text-base font-medium text-white">{title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-white/50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.33, ease: "easeInOut" }}
              className="overflow-hidden"
              data-slot="accordion-content"
            >
              <div className="pb-5 text-sm leading-relaxed text-white/60">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
AccordionItem.displayName = "Accordion.Item";

/* ─── Compound Export ───────────────────────── */

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});

export { Accordion };

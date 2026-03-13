import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Context ───────────────────────────────── */

type AccordionContextValue = {
  openItems: Set<string>;
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
};

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, mode = "single", defaultOpen = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<Set<string>>(
      () => new Set(defaultOpen)
    );

    const toggle = useCallback(
      (id: string) => {
        setOpenItems((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            if (mode === "single") {
              next.clear();
            }
            next.add(id);
          }
          return next;
        });
      },
      [mode]
    );

    const value = useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

    return (
      <AccordionContext.Provider value={value}>
        <div ref={ref} className={cn("space-y-0", className)} {...props}>
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
    const isOpen = openItems.has(value);

    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-dotted border-white/10",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => toggle(value)}
          className="flex w-full cursor-pointer items-center justify-between py-4 md:py-5 min-h-[44px] text-left"
        >
          <span className="text-sm md:text-base font-medium text-white">{title}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
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

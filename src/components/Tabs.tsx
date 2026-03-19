"use client";

import {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";
import { useRovingTabIndex } from "../hooks/useRovingTabIndex";

const tabsContainerVariants = cva("relative flex overflow-x-auto", {
  variants: {
    variant: {
      pills: "bg-white/[0.04] rounded-full p-1 shadow-xs",
      underline: "border-b border-white/10",
      segment: "bg-white/[0.04] rounded-lg p-0.5 shadow-xs",
    },
  },
  defaultVariants: {
    variant: "pills",
  },
});

const tabItemVariants = cva(
  "relative z-10 cursor-pointer select-none text-[13px] font-medium transition-all duration-200 whitespace-nowrap flex items-center justify-center",
  {
    variants: {
      variant: {
        pills: "rounded-full px-4 py-1.5",
        underline: "pb-3 px-4 pt-2",
        segment: "rounded-md px-3 py-1.5",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "pills", active: true, class: "text-[#18191a] bg-white" },
      { variant: "pills", active: false, class: "text-white/70 hover:text-white" },
      { variant: "underline", active: true, class: "text-white" },
      { variant: "underline", active: false, class: "text-white/70 hover:text-white" },
      { variant: "segment", active: true, class: "text-white" },
      { variant: "segment", active: false, class: "text-white/70 hover:text-white" },
    ],
    defaultVariants: {
      variant: "pills",
      active: false,
    },
  }
);

export interface TabItem {
  label: string;
  value: string;
  badge?: string;
}

/* ─── Internal context for linking List ↔ Panel ────── */

interface TabsContextValue {
  value: string;
  instanceId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs.Panel must be used inside a Tabs component");
  }
  return ctx;
}

/* ─── TabPanel ────────────────────────────── */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Must match one of the tab item `value` strings */
  value: string;
  children?: ReactNode;
}

function TabPanel({ value, children, className, ...props }: TabPanelProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  const tabId = `${ctx.instanceId}-tab-${value}`;
  const panelId = `${ctx.instanceId}-panel-${value}`;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn(className)}
      data-slot="tabs-panel"
      {...props}
    >
      {children}
    </div>
  );
}

TabPanel.displayName = "Tabs.Panel";

/* ─── Tabs root ───────────────────────────── */

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof tabsContainerVariants> & {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    children?: ReactNode;
  };

function TabsRoot({
  className,
  variant = "pills",
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  children,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState(
    controlledValue,
    defaultValue ?? items[0]?.value ?? "",
    onChange
  );
  const instanceId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const { onKeyDown } = useRovingTabIndex(listRef, {
    direction: "horizontal",
    loop: true,
    itemSelector: '[role="tab"]',
  });

  const handleTabClick = (itemValue: string) => {
    setValue(itemValue);
  };

  return (
    <TabsContext.Provider value={{ value, instanceId }}>
      <LayoutGroup id={instanceId}>
        <div
          ref={listRef}
          className={cn(tabsContainerVariants({ variant }), className)}
          role="tablist"
          data-slot="tabs"
          onKeyDown={(e) => {
            // Let the roving hook handle focus movement
            onKeyDown(e);

            // After roving hook moved focus, read the new focused element's value
            const newFocused = document.activeElement as HTMLElement;
            const newValue = newFocused?.getAttribute("data-value");
            if (newValue && newValue !== value) {
              setValue(newValue);
            }
          }}
          {...props}
        >
          {items.map((item) => {
            const isActive = item.value === value;
            const tabId = `${instanceId}-tab-${item.value}`;
            const panelId = `${instanceId}-panel-${item.value}`;
            return (
              <button
                key={item.value}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                data-state={isActive ? "active" : "inactive"}
                data-value={item.value}
                className={cn(tabItemVariants({ variant, active: isActive }))}
                onClick={() => handleTabClick(item.value)}
              >
                {isActive && variant === "pills" && (
                  <motion.span
                    layoutId="tabs-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-soft"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                {isActive && variant === "underline" && (
                  <motion.span
                    layoutId="tabs-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                {isActive && variant === "segment" && (
                  <motion.span
                    layoutId="tabs-segment"
                    className="absolute inset-0 rounded-md bg-white/10 shadow-soft"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span className="relative z-10 ml-2 inline-flex items-center rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {children}
      </LayoutGroup>
    </TabsContext.Provider>
  );
}

TabsRoot.displayName = "Tabs";

/* ─── Compound export ─────────────────────── */

const Tabs = Object.assign(TabsRoot, {
  Panel: TabPanel,
});

export { Tabs, tabsContainerVariants, tabItemVariants };

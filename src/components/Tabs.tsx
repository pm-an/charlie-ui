"use client";

import { type HTMLAttributes, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "../utils/cn";
import { useControllableState } from "../hooks/useControllableState";

const tabsContainerVariants = cva("relative flex overflow-x-auto", {
  variants: {
    variant: {
      pills: "bg-white/5 rounded-full p-1",
      underline: "border-b border-white/10",
      segment: "bg-white/5 rounded-lg p-0.5",
    },
  },
  defaultVariants: {
    variant: "pills",
  },
});

const tabItemVariants = cva(
  "relative z-10 cursor-pointer select-none text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center",
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
      { variant: "pills", active: true, class: "text-[#18191a]" },
      { variant: "pills", active: false, class: "text-white/60 hover:text-white" },
      { variant: "underline", active: true, class: "text-white" },
      { variant: "underline", active: false, class: "text-white/60 hover:text-white" },
      { variant: "segment", active: true, class: "text-white" },
      { variant: "segment", active: false, class: "text-white/60 hover:text-white" },
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

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof tabsContainerVariants> & {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
  };

function Tabs({
  className,
  variant = "pills",
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState(
    controlledValue,
    defaultValue ?? items[0]?.value ?? "",
    onChange
  );
  const id = useId();
  return (
    <LayoutGroup id={id}>
    <div
      className={cn(tabsContainerVariants({ variant }), className)}
      role="tablist"
      data-slot="tabs"
      {...props}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            className={cn(tabItemVariants({ variant, active: isActive }))}
            onClick={() => setValue(item.value)}
          >
            {isActive && variant === "pills" && (
              <motion.span
                layoutId="tabs-pill"
                className="absolute inset-0 rounded-full bg-white"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {isActive && variant === "underline" && (
              <motion.span
                layoutId="tabs-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {isActive && variant === "segment" && (
              <motion.span
                layoutId="tabs-segment"
                className="absolute inset-0 rounded-md bg-white/10"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {item.label}
            {item.badge && (
              <span className="ml-2 inline-flex items-center rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/60">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
    </LayoutGroup>
  );
}

Tabs.displayName = "Tabs";

export { Tabs, tabsContainerVariants, tabItemVariants };

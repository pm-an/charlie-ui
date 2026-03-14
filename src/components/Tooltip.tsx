"use client";

import { type ReactNode, type CSSProperties, useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

const sideConfig = {
  top: {
    style: { bottom: "100%", left: "50%", marginBottom: 8 } as CSSProperties,
    initial: { opacity: 0, x: "-50%", y: 4 },
    animate: { opacity: 1, x: "-50%", y: 0 },
    exit: { opacity: 0, x: "-50%", y: 4 },
  },
  bottom: {
    style: { top: "100%", left: "50%", marginTop: 8 } as CSSProperties,
    initial: { opacity: 0, x: "-50%", y: -4 },
    animate: { opacity: 1, x: "-50%", y: 0 },
    exit: { opacity: 0, x: "-50%", y: -4 },
  },
  left: {
    style: { right: "100%", top: "50%", marginRight: 8 } as CSSProperties,
    initial: { opacity: 0, y: "-50%", x: 4 },
    animate: { opacity: 1, y: "-50%", x: 0 },
    exit: { opacity: 0, y: "-50%", x: 4 },
  },
  right: {
    style: { left: "100%", top: "50%", marginLeft: 8 } as CSSProperties,
    initial: { opacity: 0, y: "-50%", x: -4 },
    animate: { opacity: 1, y: "-50%", x: 0 },
    exit: { opacity: 0, y: "-50%", x: -4 },
  },
};

function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 200,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const config = sideConfig[side];

  return (
    <span
      data-slot="tooltip"
      className="relative inline-flex"
      data-state={visible ? "open" : "closed"}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap",
              "bg-grey-700 border border-white/10 rounded-md px-3 py-1.5",
              "text-xs text-white/80 shadow-lg",
              className
            )}
            style={config.style}
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

Tooltip.displayName = "Tooltip";

export { Tooltip };

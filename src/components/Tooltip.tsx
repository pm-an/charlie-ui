import { type ReactNode, useState, useRef, useCallback, useEffect } from "react";
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
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-2" as const,
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
  },
  bottom: {
    placement: "top-full left-1/2 -translate-x-1/2 mt-2" as const,
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  },
  left: {
    placement: "right-full top-1/2 -translate-y-1/2 mr-2" as const,
    initial: { opacity: 0, x: 4 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 4 },
  },
  right: {
    placement: "left-full top-1/2 -translate-y-1/2 ml-2" as const,
    initial: { opacity: 0, x: -4 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -4 },
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
      className="relative inline-flex"
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
              config.placement,
              className
            )}
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={{ duration: 0.15, ease: "easeOut" }}
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

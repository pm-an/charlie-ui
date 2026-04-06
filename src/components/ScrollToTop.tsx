"use client";

import { forwardRef, useEffect, useState, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "./Button";

export type ScrollToTopProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Scroll threshold in pixels before the button appears */
  threshold?: number;
  /** Position offset from the edge of the screen */
  offset?: { bottom?: number; right?: number };
};

const ScrollToTop = forwardRef<HTMLButtonElement, ScrollToTopProps>(
  ({ className, threshold = 300, offset, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        setVisible(window.scrollY > threshold);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);

    const bottom = offset?.bottom ?? 24;
    const right = offset?.right ?? 24;

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("fixed z-50")}
            style={{ bottom, right }}
          >
            <Button
              ref={ref}
              variant="secondary"
              size="icon"
              className={cn(
                "backdrop-blur-sm bg-bg-subtle hover:bg-bg-subtle-hover border-border-strong shadow-lg",
                className
              )}
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              aria-label="Scroll to top"
              {...props}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ScrollToTop.displayName = "ScrollToTop";

export { ScrollToTop };

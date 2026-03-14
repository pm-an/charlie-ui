import { useState, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner, type SpinnerProps } from "./Spinner";

export type SpinnerOverlayProps = HTMLAttributes<HTMLDivElement> & {
  spinning?: boolean;
  delay?: number;
  fullscreen?: boolean;
  blur?: number;
  spinnerProps?: SpinnerProps;
  indicator?: ReactNode;
  description?: string;
  children?: ReactNode;
};

function SpinnerOverlay({
  spinning = true,
  delay = 0,
  fullscreen = false,
  blur = 0,
  spinnerProps,
  indicator,
  description,
  children,
  className,
  ...props
}: SpinnerOverlayProps) {
  const [isVisible, setIsVisible] = useState(delay ? false : spinning);

  useEffect(() => {
    if (!spinning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: syncing visibility with spinning prop
      setIsVisible(false);
      return;
    }
    if (!delay) {
      setIsVisible(true);
      return;
    }
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [spinning, delay]);

  const blurStyle =
    blur > 0 ? { backdropFilter: `blur(${blur}px)` } : undefined;

  // Fullscreen mode
  if (fullscreen) {
    return (
      <>
        {children}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/90"
              style={blurStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-busy="true"
              data-testid="spinner-overlay"
            >
              {indicator || (
                <Spinner {...spinnerProps} size={spinnerProps?.size ?? "xl"} />
              )}
              {description && (
                <p className="mt-4 text-base text-white/70">{description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // No children mode — render inline
  if (!children) {
    return (
      <div
        className={cn(
          "inline-flex flex-col items-center justify-center",
          className
        )}
        {...props}
      >
        {indicator || <Spinner {...spinnerProps} />}
        {description && (
          <p className="mt-3 text-sm text-white/70">{description}</p>
        )}
      </div>
    );
  }

  // Wrapper mode (has children)
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg/80 rounded-[inherit]"
            style={blurStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-busy="true"
            data-testid="spinner-overlay"
          >
            {indicator || <Spinner {...spinnerProps} />}
            {description && (
              <p className="mt-3 text-sm text-white/70">{description}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

SpinnerOverlay.displayName = "SpinnerOverlay";

export { SpinnerOverlay };

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal" | "both";
  maxHeight?: string | number;
  maxWidth?: string | number;
  scrollbarSize?: "thin" | "default";
  hideScrollbar?: boolean;
  /** Optional label for accessibility — when set, applies `role="region"` + `aria-label` */
  label?: string;
};

const firefoxScrollbarStyles = {
  thin: {
    scrollbarWidth: "thin" as const,
    scrollbarColor: "rgba(255,255,255,0.1) transparent",
  },
  default: {
    scrollbarWidth: "auto" as const,
    scrollbarColor: "rgba(255,255,255,0.15) rgba(255,255,255,0.05)",
  },
  hidden: {
    scrollbarWidth: "none" as const,
  },
};

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      orientation = "vertical",
      maxHeight,
      maxWidth,
      scrollbarSize = "thin",
      hideScrollbar = false,
      label,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const firefoxStyle = hideScrollbar
      ? firefoxScrollbarStyles.hidden
      : firefoxScrollbarStyles[scrollbarSize];

    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        tabIndex={0}
        role={label ? "region" : undefined}
        aria-label={label}
        className={cn(
          "relative",
          "outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent rounded-sm",
          orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
          orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
          orientation === "both" && "overflow-auto",
          !hideScrollbar &&
            scrollbarSize === "thin" && [
              "[&::-webkit-scrollbar]:w-1.5",
              "[&::-webkit-scrollbar]:h-1.5",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:bg-white/10",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb:hover]:bg-white/20",
            ],
          !hideScrollbar &&
            scrollbarSize === "default" && [
              "[&::-webkit-scrollbar]:w-2.5",
              "[&::-webkit-scrollbar]:h-2.5",
              "[&::-webkit-scrollbar-track]:bg-white/5",
              "[&::-webkit-scrollbar-track]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:bg-white/15",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              "[&::-webkit-scrollbar-thumb:hover]:bg-white/25",
            ],
          hideScrollbar && ["scrollbar-none", "[&::-webkit-scrollbar]:hidden"],
          className
        )}
        style={{
          maxHeight:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          ...firefoxStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };

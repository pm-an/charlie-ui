"use client";

import {
  createContext,
  useContext,
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
} from "react";
import { cn } from "../utils/cn";

/* ─── Context ───────────────────────────────── */

type TimelineContextValue = {
  orientation: "left" | "right" | "alternate";
};

const TimelineContext = createContext<TimelineContextValue>({
  orientation: "left",
});

function useTimeline() {
  return useContext(TimelineContext);
}

/* ─── Timeline Root ─────────────────────────── */

export type TimelineProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "left" | "right" | "alternate";
};

const TimelineRoot = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation = "left", children, ...props }, ref) => {
    const items = Children.toArray(children);

    return (
      <TimelineContext.Provider value={{ orientation }}>
        <div ref={ref} data-slot="timeline" className={cn("relative", className)} {...props}>
          {items.map((child, index) => {
            if (isValidElement(child)) {
              return cloneElement(
                child as ReactElement<{ _index?: number; _isLast?: boolean }>,
                {
                  _index: index,
                  _isLast: index === items.length - 1,
                }
              );
            }
            return child;
          })}
        </div>
      </TimelineContext.Provider>
    );
  }
);
TimelineRoot.displayName = "Timeline";

/* ─── Color Map ─────────────────────────────── */

const dotColors = {
  default: "border-white/20 bg-white/10",
  accent: "border-accent bg-accent/20",
  green: "border-green bg-green/20",
  red: "border-red bg-red/20",
  blue: "border-blue bg-blue/20",
  yellow: "border-yellow bg-yellow/20",
};

const iconBgColors = {
  default: "bg-white/10 text-white/80",
  accent: "bg-accent/20 text-[#f87171]",
  green: "bg-green/20 text-green",
  red: "bg-red/20 text-[#f87171]",
  blue: "bg-blue/20 text-blue",
  yellow: "bg-yellow/20 text-yellow",
};

/* ─── Timeline Item ─────────────────────────── */

export type TimelineItemProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: ReactNode;
  color?: "default" | "accent" | "green" | "red" | "blue" | "yellow";
  active?: boolean;
  children?: ReactNode;
  /** @internal injected by Timeline */
  _index?: number;
  /** @internal injected by Timeline */
  _isLast?: boolean;
};

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      title,
      description,
      timestamp,
      icon,
      color = "default",
      active = false,
      children,
      _index = 0,
      _isLast = false,
      ...props
    },
    ref
  ) => {
    const { orientation } = useTimeline();

    const isRight =
      orientation === "right" ||
      (orientation === "alternate" && _index % 2 === 1);

    const hasIcon = !!icon;

    const dot = hasIcon ? (
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          iconBgColors[color],
          active && "ring-2 ring-accent/30"
        )}
      >
        {icon}
      </div>
    ) : (
      <div
        className={cn(
          "h-3 w-3 shrink-0 rounded-full border-2",
          dotColors[color],
          active && "ring-2 ring-accent/30"
        )}
      />
    );

    const connector = !_isLast && (
      <div
        className={cn(
          "flex-1 self-stretch",
          hasIcon ? "ml-[15px] w-0.5 bg-white/10" : "ml-[5px] w-0.5 bg-white/10"
        )}
        data-testid="timeline-connector"
      />
    );

    const content = (
      <div className="min-w-0 flex-1 pb-6">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              "text-sm",
              active ? "font-medium text-white" : "font-medium text-white/80"
            )}
          >
            {title}
          </h4>
          {timestamp && (
            <time className="shrink-0 text-xs text-white/70" dateTime={timestamp}>{timestamp}</time>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-sm text-white/70">{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          isRight && "flex-row-reverse text-right",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className={cn("flex items-center", hasIcon ? "h-8" : "mt-1 h-3")}>
            {dot}
          </div>
          {connector}
        </div>
        {content}
      </div>
    );
  }
);
TimelineItem.displayName = "Timeline.Item";

/* ─── Compound Export ───────────────────────── */

const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
});

export { Timeline };

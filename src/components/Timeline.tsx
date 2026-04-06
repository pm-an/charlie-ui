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

/* ─── Size + Color Maps ────────────────────── */

const sizeConfig = {
  sm: {
    icon: "h-8 w-8",
    iconAlign: "h-8",
    dot: "h-3 w-3",
    dotAlign: "mt-1 h-3",
    connectorIcon: "ml-[15px]",
    connectorDot: "ml-[5px]",
    title: "text-sm",
    description: "text-sm",
    gap: "gap-3",
    contentPb: "pb-6",
  },
  md: {
    icon: "h-10 w-10",
    iconAlign: "h-10",
    dot: "h-4 w-4",
    dotAlign: "mt-1 h-4",
    connectorIcon: "ml-[19px]",
    connectorDot: "ml-[7px]",
    title: "text-base",
    description: "text-sm",
    gap: "gap-4",
    contentPb: "pb-8",
  },
  lg: {
    icon: "h-12 w-12",
    iconAlign: "h-12",
    dot: "h-5 w-5",
    dotAlign: "mt-1 h-5",
    connectorIcon: "ml-[23px]",
    connectorDot: "ml-[9px]",
    title: "text-lg",
    description: "text-base",
    gap: "gap-4",
    contentPb: "pb-10",
  },
};

const dotColors = {
  default: "border-border-hover bg-bg-subtle-hover",
  accent: "border-accent bg-accent/20",
  green: "border-green bg-green/20",
  blue: "border-blue bg-blue/20",
  yellow: "border-yellow bg-yellow/20",
};

const iconBgColors = {
  default: "bg-bg-subtle-hover text-fg-200",
  accent: "bg-accent/20 text-accent",
  green: "bg-green/20 text-green",
  blue: "bg-blue/20 text-blue",
  yellow: "bg-yellow/20 text-yellow",
};

/* ─── Timeline Item ─────────────────────────── */

export type TimelineItemProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: ReactNode;
  color?: "default" | "accent" | "green" | "blue" | "yellow";
  size?: "sm" | "md" | "lg";
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
      size = "sm",
      active = false,
      children,
      _index = 0,
      _isLast = false,
      ...props
    },
    ref
  ) => {
    const { orientation } = useTimeline();
    const s = sizeConfig[size];

    const isRight =
      orientation === "right" ||
      (orientation === "alternate" && _index % 2 === 1);

    const hasIcon = !!icon;

    const dot = hasIcon ? (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          s.icon,
          iconBgColors[color],
          active && "ring-2 ring-accent/30"
        )}
      >
        {icon}
      </div>
    ) : (
      <div
        className={cn(
          "shrink-0 rounded-full border-2",
          s.dot,
          dotColors[color],
          active && "ring-2 ring-accent/30"
        )}
      />
    );

    const connector = !_isLast && (
      <div
        className={cn(
          "flex-1 self-stretch w-0.5 bg-bg-subtle-hover",
          hasIcon ? s.connectorIcon : s.connectorDot
        )}
        data-testid="timeline-connector"
      />
    );

    const content = (
      <div className={cn("min-w-0 flex-1", s.contentPb)}>
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              s.title,
              active ? "font-semibold text-text-loud" : "font-semibold text-fg-200"
            )}
          >
            {title}
          </h4>
          {timestamp && (
            <time className="shrink-0 text-xs text-fg-200" dateTime={timestamp}>{timestamp}</time>
          )}
        </div>
        {description && (
          <p className={cn("mt-1", s.description, "text-fg-300")}>{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          s.gap,
          isRight && "flex-row-reverse text-right",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className={cn("flex items-center", hasIcon ? s.iconAlign : s.dotAlign)}>
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

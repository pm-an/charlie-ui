import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";

export type SpinnerType = "ring" | "dots" | "bars" | "pulse" | "ring-fill";
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  type?: SpinnerType;
  size?: SpinnerSize;
  color?: string;
  label?: string;
  showLabel?: boolean;
  thickness?: number;
  speed?: number;
};

export const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const dotSizeMap: Record<SpinnerSize, number> = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
};

const barSizeMap: Record<SpinnerSize, { width: number; height: number }> = {
  xs: { width: 2, height: 8 },
  sm: { width: 2, height: 12 },
  md: { width: 3, height: 16 },
  lg: { width: 4, height: 20 },
  xl: { width: 5, height: 28 },
};

const defaultThicknessMap: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
};

function RingSpinner({
  size,
  thickness,
  speed,
}: {
  size: SpinnerSize;
  thickness: number;
  speed: number;
}) {
  const px = sizeMap[size];
  return (
    <div
      className="rounded-full border-current/20 border-t-current animate-spin"
      style={{
        width: px,
        height: px,
        borderWidth: thickness,
        borderStyle: "solid",
        animationDuration: `${0.75 / speed}s`,
      }}
    />
  );
}

function RingFillSpinner({
  size,
  thickness,
  speed,
}: {
  size: SpinnerSize;
  thickness: number;
  speed: number;
}) {
  const px = sizeMap[size];
  return (
    <svg viewBox="0 0 24 24" width={px} height={px}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth={(thickness / px) * 24}
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth={(thickness / px) * 24}
        strokeLinecap="round"
        strokeDasharray="60 200"
        className="animate-spin origin-center"
        style={{ animationDuration: `${1 / speed}s` }}
      />
    </svg>
  );
}

function DotsSpinner({
  size,
  speed,
}: {
  size: SpinnerSize;
  speed: number;
}) {
  const dotSize = dotSizeMap[size];
  return (
    <motion.div
      className="flex items-center gap-1"
      variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
      animate="animate"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full bg-current"
          style={{ width: dotSize, height: dotSize }}
          variants={{
            animate: {
              y: [0, -dotSize * 0.6, 0],
              transition: {
                duration: 0.6 / speed,
                repeat: Infinity,
                ease: "easeInOut",
              },
            },
          }}
        />
      ))}
    </motion.div>
  );
}

function BarsSpinner({
  size,
  speed,
}: {
  size: SpinnerSize;
  speed: number;
}) {
  const { width: barWidth, height: barHeight } = barSizeMap[size];
  return (
    <motion.div
      className="flex items-center gap-0.5"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      animate="animate"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-sm bg-current"
          style={{ width: barWidth, height: barHeight }}
          variants={{
            animate: {
              scaleY: [0.4, 1, 0.4],
              transition: {
                duration: 0.8 / speed,
                repeat: Infinity,
                ease: "easeInOut",
              },
            },
          }}
        />
      ))}
    </motion.div>
  );
}

function PulseSpinner({
  size,
  speed,
}: {
  size: SpinnerSize;
  speed: number;
}) {
  const px = sizeMap[size];
  return (
    <motion.div
      className="rounded-full bg-current"
      style={{ width: px, height: px }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.2 / speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function Spinner({
  type = "ring",
  size = "md",
  color,
  label = "Loading",
  showLabel = false,
  thickness,
  speed = 1,
  className,
  style,
  ...props
}: SpinnerProps) {
  const resolvedThickness = thickness ?? defaultThicknessMap[size];

  const spinnerVisual = (() => {
    switch (type) {
      case "ring":
        return (
          <RingSpinner
            size={size}
            thickness={resolvedThickness}
            speed={speed}
          />
        );
      case "ring-fill":
        return (
          <RingFillSpinner
            size={size}
            thickness={resolvedThickness}
            speed={speed}
          />
        );
      case "dots":
        return <DotsSpinner size={size} speed={speed} />;
      case "bars":
        return <BarsSpinner size={size} speed={speed} />;
      case "pulse":
        return <PulseSpinner size={size} speed={speed} />;
      default:
        return (
          <RingSpinner
            size={size}
            thickness={resolvedThickness}
            speed={speed}
          />
        );
    }
  })();

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex flex-col items-center justify-center",
        className
      )}
      style={{ color: color || undefined, ...style }}
      {...props}
    >
      {spinnerVisual}
      <span
        className={
          showLabel ? "text-sm text-white/60 mt-2" : "sr-only"
        }
      >
        {label}
      </span>
    </div>
  );
}

Spinner.displayName = "Spinner";

export { Spinner };

import { type CSSProperties } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

const gradientVariants = cva(
  "absolute inset-0 overflow-hidden pointer-events-none",
  {
    variants: {
      variant: {
        aurora: "",
        nebula: "",
        warm: "",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "aurora",
    },
  }
);

const gradientStyles: Record<string, string> = {
  aurora:
    "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,99,99,0.15), rgba(155,77,255,0.08), transparent)",
  nebula:
    "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(86,194,255,0.1), rgba(155,77,255,0.1), transparent)",
  warm:
    "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,146,23,0.1), rgba(255,99,99,0.08), transparent)",
};

export type GradientBackgroundProps = VariantProps<typeof gradientVariants> & {
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
};

function GradientBackground({
  className,
  variant = "aurora",
  animate = false,
  style,
}: GradientBackgroundProps) {
  const bg = variant && variant !== "custom" ? gradientStyles[variant] : undefined;
  const combinedStyle = bg ? { ...style, background: bg } : style;

  if (animate) {
    return (
      <motion.div
        className={cn(gradientVariants({ variant }), className)}
        style={combinedStyle}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return (
    <div
      className={cn(gradientVariants({ variant }), className)}
      style={combinedStyle}
    />
  );
}

GradientBackground.displayName = "GradientBackground";

export { GradientBackground, gradientVariants };

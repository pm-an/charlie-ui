"use client";

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
    "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-accent) 15%, transparent), color-mix(in srgb, var(--color-purple) 8%, transparent), transparent)",
  nebula:
    "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-blue) 10%, transparent), color-mix(in srgb, var(--color-purple) 10%, transparent), transparent)",
  warm:
    "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-orange) 10%, transparent), color-mix(in srgb, var(--color-accent) 8%, transparent), transparent)",
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
        data-slot="gradient-background"
        className={cn(gradientVariants({ variant }), className)}
        style={combinedStyle}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return (
    <div
      data-slot="gradient-background"
      className={cn(gradientVariants({ variant }), className)}
      style={combinedStyle}
    />
  );
}

GradientBackground.displayName = "GradientBackground";

export { GradientBackground, gradientVariants };

"use client";

import { useState, useCallback, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "../utils/cn";

/* ─── Variants ───────────────────────────────── */

const copyButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-md font-medium transition-colors duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white/5 border border-white/10",
          "text-white/70 hover:bg-white/10 hover:text-white",
        ],
        ghost: [
          "bg-transparent text-white/70",
          "hover:bg-white/5 hover:text-white",
        ],
        outline: [
          "border border-white/10 text-white/70",
          "hover:border-white/20",
        ],
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/* ─── Icon sizes ─────────────────────────────── */

const iconSizeMap = { sm: 14, md: 16, lg: 16 } as const;

/* ─── Types ──────────────────────────────────── */

export type CopyButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> &
  VariantProps<typeof copyButtonVariants> & {
    value: string;
    timeout?: number;
    label?: string;
    copiedLabel?: string;
    iconOnly?: boolean;
    onCopy?: () => void;
  };

/* ─── Component ──────────────────────────────── */

function CopyButton({
  value,
  timeout = 2000,
  variant,
  size,
  label = "Copy",
  copiedLabel = "Copied!",
  iconOnly = false,
  onCopy,
  disabled,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const iconSize = iconSizeMap[size ?? "md"];

  const copy = useCallback(async () => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API may be unavailable in some environments
    }
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), timeout);
  }, [value, timeout, onCopy, disabled]);

  return (
    <button
      type="button"
      data-slot="copy-button"
      disabled={disabled}
      className={cn(copyButtonVariants({ variant, size }), className)}
      onClick={copy}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            className="inline-flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={iconSize} className="text-green" />
            {!iconOnly && <span>{copiedLabel}</span>}
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="inline-flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Copy size={iconSize} />
            {!iconOnly && <span>{label}</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

CopyButton.displayName = "CopyButton";

export { CopyButton, copyButtonVariants };

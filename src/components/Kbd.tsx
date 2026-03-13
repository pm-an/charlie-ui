import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type KbdProps = HTMLAttributes<HTMLElement>;

function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "bg-white/5 border border-white/10 rounded-[4px]",
        "px-1.5 py-0.5 text-[11px] font-mono text-white/60",
        "shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

Kbd.displayName = "Kbd";

export { Kbd };

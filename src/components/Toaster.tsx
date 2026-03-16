"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, toast, type ToastData } from "./toast-store";
import { Toast } from "./Toast";
import { cn } from "../utils/cn";

const positionClasses = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
} as const;

export type ToasterPosition = keyof typeof positionClasses;

export type ToasterProps = {
  /** Default duration for toasts in ms. 0 = no auto-dismiss. */
  duration?: number;
  /** Maximum number of visible toasts */
  max?: number;
  /** Position of the toast container */
  position?: ToasterPosition;
};

function Toaster({ duration = 5000, max = 5, position = "bottom-right" }: ToasterProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const visible = toasts.slice(-max);

  return (
    <div
      data-slot="toaster"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        "fixed z-50 flex flex-col gap-2 p-4 md:p-6 pointer-events-none",
        positionClasses[position],
      )}
      style={{ maxHeight: "100vh" }}
    >
      {visible.map((t: ToastData, index: number) => (
        <div
          key={t.id}
          className="pointer-events-auto"
          style={{ zIndex: index }}
        >
          <Toast
            variant={t.variant}
            title={t.title}
            description={t.description}
            action={t.action}
            duration={t.duration ?? duration}
            open
            onClose={() => toast.dismiss(t.id)}
            className="relative static md:static md:min-w-[320px] md:max-w-[420px]"
          />
        </div>
      ))}
    </div>
  );
}

Toaster.displayName = "Toaster";

export { Toaster };

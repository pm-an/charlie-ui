"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, toast, type ToastData } from "./toast-store";
import { Toast } from "./Toast";

export type ToasterProps = {
  /** Default duration for toasts in ms. 0 = no auto-dismiss. */
  duration?: number;
  /** Maximum number of visible toasts */
  max?: number;
};

function Toaster({ duration = 5000, max = 5 }: ToasterProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const visible = toasts.slice(-max);

  return (
    <div
      data-slot="toaster"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:p-6 pointer-events-none"
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

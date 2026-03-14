import type { ReactNode } from "react";

/* ─── Types ──────────────────────────────── */

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  action?: ReactNode;
  duration?: number;
};

type Listener = () => void;

/* ─── Store ──────────────────────────────── */

let toasts: ToastData[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function genId() {
  return `toast-${++counter}-${Date.now()}`;
}

/* ─── Public API ─────────────────────────── */

type ToastOptions = {
  description?: string;
  action?: ReactNode;
  duration?: number;
};

function createToast(
  title: string,
  variant: ToastVariant = "default",
  options: ToastOptions = {}
): string {
  const id = genId();
  const newToast: ToastData = {
    id,
    title,
    variant,
    description: options.description,
    action: options.action,
    duration: options.duration,
  };
  toasts = [...toasts, newToast];
  emit();
  return id;
}

/**
 * Imperative toast API.
 *
 * Usage:
 *   toast("Saved!")
 *   toast.success("Deployed!", { description: "All checks passed." })
 *   toast.error("Failed to save")
 *   toast.warning("Trial expires soon")
 *   toast.dismiss(id)
 *   toast.dismissAll()
 */
function toast(title: string, options?: ToastOptions): string {
  return createToast(title, "default", options);
}

toast.success = (title: string, options?: ToastOptions) =>
  createToast(title, "success", options);

toast.error = (title: string, options?: ToastOptions) =>
  createToast(title, "error", options);

toast.warning = (title: string, options?: ToastOptions) =>
  createToast(title, "warning", options);

toast.dismiss = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

toast.dismissAll = () => {
  toasts = [];
  emit();
};

/* ─── Store access (for Toaster component) ── */

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): ToastData[] {
  return toasts;
}

export { toast };

// FullscreenModal is deprecated — use <Modal fullscreen> instead.
"use client";

import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { Modal, type ModalProps } from "./Modal";
import { cn } from "../utils/cn";

/* ─── FullscreenModal (root) ─────────────────── */

export type FullscreenModalProps = Omit<ModalProps, "fullscreen" | "size">;

function FullscreenModalRoot(props: FullscreenModalProps) {
  return <Modal {...props} fullscreen />;
}

FullscreenModalRoot.displayName = "FullscreenModal";

/* ─── FullscreenModal.Body ───────────────────── */

export type FullscreenModalBodyProps = HTMLAttributes<HTMLDivElement>;

const FullscreenModalBody = forwardRef<HTMLDivElement, FullscreenModalBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
);
FullscreenModalBody.displayName = "FullscreenModal.Body";

/* ─── FullscreenModal.Footer ─────────────────── */

export type FullscreenModalFooterProps = HTMLAttributes<HTMLDivElement>;

const FullscreenModalFooter = forwardRef<HTMLDivElement, FullscreenModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "sticky bottom-0 border-t border-white/[0.06] bg-grey-700 px-6 py-4 flex items-center justify-end gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
FullscreenModalFooter.displayName = "FullscreenModal.Footer";

/* ─── Compound Export ────────────────────────── */

const FullscreenModal = Object.assign(FullscreenModalRoot, {
  Body: FullscreenModalBody,
  Footer: FullscreenModalFooter,
});

export { FullscreenModal };

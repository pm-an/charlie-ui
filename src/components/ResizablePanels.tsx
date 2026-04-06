import { type ReactNode } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type PanelGroupProps,
  type PanelProps,
  type PanelResizeHandleProps,
} from "react-resizable-panels";
import { GripVertical, GripHorizontal } from "lucide-react";
import { cn } from "../utils/cn";

type ResizablePanelsProps = Omit<PanelGroupProps, "children"> & {
  children: ReactNode;
  className?: string;
};

type ResizablePanelProps = PanelProps & {
  className?: string;
};

type ResizableHandleProps = Omit<PanelResizeHandleProps, "children"> & {
  withHandle?: boolean;
  /** Accessible label for the resize handle (default: "Resize panel") */
  handleAriaLabel?: string;
  className?: string;
};

function ResizablePanelsRoot({ className, ...props }: ResizablePanelsProps) {
  return (
    <PanelGroup data-slot="resizable-panels" className={cn("flex h-full w-full", className)} {...props} />
  );
}

function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return <Panel className={cn("overflow-auto", className)} {...props} />;
}

function ResizableHandle({
  withHandle = false,
  handleAriaLabel = "Resize panel",
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex items-center justify-center",
        "bg-bg-subtle transition-colors",
        "hover:bg-accent/30",
        "data-[resize-handle-active]:bg-accent/50",
        "data-[panel-group-direction=horizontal]:w-px",
        "data-[panel-group-direction=vertical]:h-px",
        withHandle && "data-[panel-group-direction=horizontal]:w-2",
        withHandle && "data-[panel-group-direction=vertical]:h-2",
        className
      )}
      aria-label={handleAriaLabel}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex items-center justify-center rounded-sm border border-border-strong bg-bg-200">
          <GripVertical aria-hidden="true" className="h-3 w-3 text-fg-200 data-[panel-group-direction=vertical]:hidden" />
          <GripHorizontal aria-hidden="true" className="h-3 w-3 text-fg-200 hidden data-[panel-group-direction=vertical]:block" />
        </div>
      )}
    </PanelResizeHandle>
  );
}

ResizablePanelsRoot.displayName = "ResizablePanels";
ResizablePanel.displayName = "ResizablePanels.Panel";
ResizableHandle.displayName = "ResizablePanels.Handle";

const ResizablePanels = Object.assign(ResizablePanelsRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

export { ResizablePanels };
export type { ResizablePanelsProps, ResizablePanelProps, ResizableHandleProps };

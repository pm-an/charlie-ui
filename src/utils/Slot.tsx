import {
  cloneElement,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
  type Ref,
} from "react";
import { cn } from "./cn";
import { composeRefs } from "./composeRefs";

export type SlotProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  ref?: Ref<HTMLElement>;
};

/**
 * Slot merges its props (className, style, event handlers, ref) onto its single child element.
 * Used to implement the `asChild` pattern — rendering a component's behavior
 * onto a consumer-provided element (e.g., rendering Button as a Link).
 *
 * Expects exactly one valid React element child.
 */
function Slot({ children, ref, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    console.warn("Slot requires a single valid React element as a child.");
    return null;
  }

  const childProps = children.props as Record<string, unknown>;

  // Merge className via cn()
  const mergedClassName = cn(
    slotProps.className as string | undefined,
    childProps.className as string | undefined
  );

  // Merge style objects
  const mergedStyle = {
    ...(slotProps.style || {}),
    ...((childProps.style as React.CSSProperties) || {}),
  };

  // Merge event handlers — slot handler runs first, then child handler
  const mergedProps: Record<string, unknown> = { ...slotProps };
  for (const key of Object.keys(childProps)) {
    if (key === "className" || key === "style" || key === "ref") continue;

    const slotHandler = slotProps[key as keyof typeof slotProps];
    const childHandler = childProps[key];

    if (
      typeof slotHandler === "function" &&
      typeof childHandler === "function" &&
      key.startsWith("on")
    ) {
      mergedProps[key] = (...args: unknown[]) => {
        (slotHandler as (...a: unknown[]) => unknown)(...args);
        (childHandler as (...a: unknown[]) => unknown)(...args);
      };
    } else {
      mergedProps[key] = childHandler !== undefined ? childHandler : slotHandler;
    }
  }

  // Merge refs
  const childRef = (children as { ref?: Ref<HTMLElement> }).ref;
  const mergedRef = ref || childRef ? composeRefs(ref, childRef) : undefined;

  return cloneElement(children, {
    ...mergedProps,
    className: mergedClassName || undefined,
    style: Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined,
    ref: mergedRef,
  } as Record<string, unknown>);
}

Slot.displayName = "Slot";

export { Slot };

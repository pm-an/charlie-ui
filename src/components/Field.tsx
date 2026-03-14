"use client";

import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import {
  FieldContext,
  useFieldContext,
  type FieldContextValue,
} from "./field-context";

/* ─── FieldLabel ───────────────────────────── */

export type FieldLabelProps = HTMLAttributes<HTMLLabelElement> & {
  /** Override the htmlFor attribute (defaults to Field context id) */
  htmlFor?: string;
};

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, children, ...props }, ref) => {
    const ctx = useFieldContext();
    const resolvedHtmlFor = htmlFor ?? ctx?.id;

    return (
      <label
        ref={ref}
        data-slot="field-label"
        className={cn("text-sm font-medium text-white/80", className)}
        htmlFor={resolvedHtmlFor}
        {...props}
      >
        {children}
      </label>
    );
  }
);
FieldLabel.displayName = "Field.Label";

/* ─── FieldDescription ─────────────────────── */

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, id, children, ...props }, ref) => {
    const ctx = useFieldContext();
    const resolvedId = id ?? ctx?.descriptionId;

    return (
      <p
        ref={ref}
        id={resolvedId}
        data-slot="field-description"
        className={cn("text-xs text-white/60", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldDescription.displayName = "Field.Description";

/* ─── FieldError ───────────────────────────── */

export type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, id, children, ...props }, ref) => {
    if (!children) return null;
    const ctx = useFieldContext();
    const resolvedId = id ?? ctx?.errorId;

    return (
      <p
        ref={ref}
        id={resolvedId}
        data-slot="field-error"
        role="alert"
        className={cn("text-xs text-red", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldError.displayName = "Field.Error";

/* ─── FieldRoot ────────────────────────────── */

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  /** Label text displayed above the form element */
  label?: string;
  /** Optional description shown below the label */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message shown below the form element */
  errorMessage?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** HTML id for the form element — auto-generated if not provided */
  htmlFor?: string;
  /** Form field name for the control */
  name?: string;
};

/**
 * Checks if children contain any of the compound sub-components
 * by looking for displayName. This is safe because this library
 * builds with preserveModules (no minification of component names).
 */
function hasCompoundChildren(children: ReactNode): boolean {
  const childArray = Array.isArray(children) ? children : [children];
  return childArray.some((child) => {
    if (child && typeof child === "object" && "type" in child) {
      const type = child.type as { displayName?: string };
      if (type.displayName) {
        return [
          "Field.Label",
          "Field.Description",
          "Field.Error",
        ].includes(type.displayName);
      }
    }
    return false;
  });
}

const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      className,
      label,
      description,
      helperText,
      error = false,
      errorMessage,
      required = false,
      disabled = false,
      htmlFor,
      name,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = htmlFor ?? `field-${generatedId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const labelId = `${id}-label`;

    // Support deprecated helperText → description
    const resolvedDescription = description ?? helperText;

    const ctxValue: FieldContextValue = {
      id,
      name,
      error,
      disabled,
      required,
      hasDescription: !!resolvedDescription,
      descriptionId,
      errorId,
      labelId,
    };

    const isCompound = hasCompoundChildren(children);

    return (
      <FieldContext.Provider value={ctxValue}>
        <div
          ref={ref}
          data-slot="field"
          className={cn("flex flex-col gap-1.5", className)}
          {...props}
        >
          {isCompound ? (
            // Compound usage: render children as-is
            children
          ) : (
            // Simple usage: auto-render label → description → children → error
            <>
              {label && (
                <label
                  htmlFor={id}
                  id={labelId}
                  className={cn(
                    "text-sm font-medium text-white/80",
                    disabled && "opacity-50",
                    required &&
                      "after:content-['*'] after:ml-0.5 after:text-red"
                  )}
                >
                  {label}
                </label>
              )}

              {resolvedDescription && (
                <p
                  id={descriptionId}
                  className="text-xs text-white/60 -mt-0.5"
                >
                  {resolvedDescription}
                </p>
              )}

              {children}

              {error && errorMessage && (
                <p id={errorId} className="text-xs text-red" role="alert">
                  {errorMessage}
                </p>
              )}
            </>
          )}
        </div>
      </FieldContext.Provider>
    );
  }
);

FieldRoot.displayName = "Field";

/* ─── Compound Export ──────────────────────── */

const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});

export { Field };
export type {
  FieldProps as FieldRootProps,
};

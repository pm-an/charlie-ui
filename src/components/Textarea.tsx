"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../utils/cn";
import { useFieldAware } from "../hooks/useFieldAware";

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "style"
> & {
  label?: string;
  /** Description text shown below the textarea */
  description?: string;
  /** @deprecated Use `description` instead */
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoResize?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      description,
      helperText,
      error: errorProp,
      errorMessage,
      resize = "vertical",
      autoResize = false,
      id,
      disabled: disabledProp,
      required: requiredProp,
      onInput,
      ...props
    },
    ref
  ) => {
    const resolvedDescription = description ?? helperText;

    const {
      controlId,
      insideField,
      error,
      disabled,
      required,
      ariaDescribedBy,
      ariaInvalid,
    } = useFieldAware({
      id: id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined),
      error: errorProp,
      disabled: disabledProp,
      required: requiredProp,
      description: resolvedDescription,
      errorMessage,
    });

    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value, props.defaultValue]);

    const handleInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        onInput?.(e as unknown as React.InputEvent<HTMLTextAreaElement>);
      },
      [adjustHeight, onInput]
    );

    const resizeStyle: Record<string, string> = {
      none: "none",
      vertical: "vertical",
      horizontal: "horizontal",
      both: "both",
    };

    // Core textarea element — shared between Field-aware and standalone modes
    const textareaElement = (
      <textarea
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
              node;
          }
        }}
        id={controlId}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        required={required}
        className={cn(
          "w-full bg-bg-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-loud shadow-input",
          "placeholder:text-text-muted",
          "outline-none transition-shadow duration-200",
          "focus:shadow-input-focus focus:border-border-hover",
          "min-h-[80px]",
          error && "border-red/50 focus:ring-red/30 focus:border-red/50",
          className
        )}
        style={{ resize: (autoResize ? "none" : resizeStyle[resize]) as React.CSSProperties["resize"] }}
        onInput={handleInput}
        {...props}
      />
    );

    // When inside a Field, render only the core element
    if (insideField) {
      return textareaElement;
    }

    // Standalone rendering — identical to original
    return (
      <div data-slot="textarea" className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={controlId}
            className="text-sm font-medium text-fg-200"
          >
            {label}
          </label>
        )}
        {textareaElement}
        {resolvedDescription && !error && (
          <p id={`${controlId}-description`} className="text-xs text-fg-200">{resolvedDescription}</p>
        )}
        {error && errorMessage && (
          <p id={`${controlId}-error`} className="text-xs text-red">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

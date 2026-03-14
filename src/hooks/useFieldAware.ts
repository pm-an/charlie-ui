"use client";

import { useId } from "react";
import { useFieldContext } from "../components/field-context";

export type UseFieldAwareOptions = {
  id?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  errorMessage?: string;
};

export type UseFieldAwareReturn = {
  /** The id to apply on the control element */
  controlId: string;
  /** Whether this control is inside a Field */
  insideField: boolean;
  /** Resolved error state (prop overrides context) */
  error: boolean;
  /** Resolved disabled state (prop overrides context) */
  disabled: boolean;
  /** Resolved required state (prop overrides context) */
  required: boolean;
  /** aria-describedby value pointing to description/error elements */
  ariaDescribedBy: string | undefined;
  /** aria-invalid value derived from error state */
  ariaInvalid: boolean | undefined;
  /** The label element's id from Field context (for aria-labelledby) */
  fieldLabelId: string | undefined;
};

/**
 * Shared hook for form controls to become Field-aware.
 *
 * When inside a `<Field>`, it pulls context values (id, error, disabled, required,
 * aria IDs). Direct props always override context values.
 *
 * When standalone, it generates its own IDs and computes aria attributes from props.
 */
export function useFieldAware(
  options: UseFieldAwareOptions = {}
): UseFieldAwareReturn {
  const ctx = useFieldContext();
  const generatedId = useId();

  const insideField = ctx !== null;

  // Props override context
  const error = options.error ?? ctx?.error ?? false;
  const disabled = options.disabled ?? ctx?.disabled ?? false;
  const required = options.required ?? ctx?.required ?? false;

  // ID: prop > context > generated
  const controlId = options.id ?? ctx?.id ?? `field-${generatedId}`;

  // Build aria-describedby
  let ariaDescribedBy: string | undefined;
  if (insideField && ctx) {
    const parts: string[] = [];
    // Only reference descriptionId when Field actually has a description
    if (ctx.hasDescription) parts.push(ctx.descriptionId);
    if (error) parts.push(ctx.errorId);
    ariaDescribedBy = parts.join(" ") || undefined;
  } else {
    // Standalone: build from own IDs
    const standaloneDescId = `${controlId}-description`;
    const standaloneErrorId = `${controlId}-error`;
    const parts: string[] = [];
    if (options.description) parts.push(standaloneDescId);
    if (error && options.errorMessage) parts.push(standaloneErrorId);
    ariaDescribedBy = parts.join(" ") || undefined;
  }

  const ariaInvalid = error || undefined;

  return {
    controlId,
    insideField,
    error,
    disabled,
    required,
    ariaDescribedBy,
    ariaInvalid,
    fieldLabelId: ctx?.labelId,
  };
}

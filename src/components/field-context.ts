"use client";

import { createContext, useContext } from "react";

export type FieldContextValue = {
  id: string;
  name?: string;
  error: boolean;
  disabled: boolean;
  required: boolean;
  hasDescription: boolean;
  descriptionId: string;
  errorId: string;
  labelId: string;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Returns the nearest Field context, or null if not inside a Field.
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

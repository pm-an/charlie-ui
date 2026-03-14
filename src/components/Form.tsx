"use client";

import {
  type ReactNode,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import {
  useController,
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type FieldPath,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";
import { Field, type FieldProps } from "./Field";

/* ─── Form Root ────────────────────────────── */

export type FormProps<T extends FieldValues> = Omit<
  HTMLAttributes<HTMLFormElement>,
  "onSubmit"
> & {
  /** The form instance from useForm() */
  form: UseFormReturn<T>;
  /** Called with validated data on successful submission */
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
};

function FormRoot<T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

FormRoot.displayName = "Form";

/* ─── Form.Field ───────────────────────────── */

export type FormFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = Omit<FieldProps, "error" | "errorMessage" | "children"> & {
  /** The form control instance (from useForm) */
  control: UseFormReturn<T>["control"];
  /** Field name path (e.g., "email", "address.city") */
  name: TName;
  /** Render function receiving controller field props */
  children: (field: {
    value: T[TName];
    onChange: ControllerRenderProps<T, TName>["onChange"];
    onBlur: ControllerRenderProps<T, TName>["onBlur"];
    ref: ControllerRenderProps<T, TName>["ref"];
    name: TName;
    disabled?: boolean;
    error: boolean;
    fieldState: ControllerFieldState;
  }) => ReactElement;
};

function FormFieldAdapter<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  control,
  name,
  children,
  label,
  description,
  required,
  disabled,
  ...fieldProps
}: FormFieldProps<T, TName>) {
  const {
    field,
    fieldState: { error, invalid },
    fieldState,
  } = useController({ control, name, disabled });

  const errorMessage = error?.message;

  return (
    <Field
      label={label}
      description={description}
      error={invalid}
      errorMessage={errorMessage}
      required={required}
      disabled={disabled}
      name={name}
      {...fieldProps}
    >
      {children({
        value: field.value,
        onChange: field.onChange,
        onBlur: field.onBlur,
        ref: field.ref,
        name: field.name as TName,
        disabled: field.disabled,
        error: invalid,
        fieldState,
      })}
    </Field>
  );
}

FormFieldAdapter.displayName = "Form.Field";

/* ─── Compound Export ──────────────────────── */

const Form = Object.assign(FormRoot, {
  Field: FormFieldAdapter,
});

export { Form };

"use client";

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  description,
  autoFocus = false,
  placeholder = "text",
  type = "text",
  disabled = false,
  required = false,
  maxLength,
  inputMode,
  min,
  max,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  autoFocus?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  min?: number | string;
  max?: number | string;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} required={required}>{label}</FieldLabel>
          {type === "textarea" ? (
            <Textarea
              {...field}
              id={field.name}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className="resize-none"
              disabled={disabled}
              required={required}
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              type={type}
              inputMode={inputMode}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              autoFocus={autoFocus}
              className="text-sm"
              disabled={disabled}
              required={required}
              maxLength={maxLength}
              min={min}
              max={max}
            />
          )}

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

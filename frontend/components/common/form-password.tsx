"use client";

import { useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function FormPassword<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder = "********",
  disabled = false,
  required = false,
  maxLength,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} required={required}>{label}</FieldLabel>

          <div className="relative">
            <Input
              {...field}
              id={field.name}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className="pr-10 text-sm"
              disabled={disabled}
              required={required}
              maxLength={maxLength}
            />

            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute inset-y-0 flex items-center cursor-pointer right-2 text-muted-foreground"
            >
              {show ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

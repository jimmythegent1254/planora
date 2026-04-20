"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  id: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
};

function FieldError<T extends FieldValues>({
  form,
  name,
  id,
}: Pick<FormFieldProps<T>, "form" | "name" | "id">) {
  const errorMessage = form.formState.errors[name]?.message;

  if (!errorMessage || typeof errorMessage !== "string") {
    return null;
  }

  return (
    <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
      {errorMessage}
    </p>
  );
}

export function NameField<T extends FieldValues>(props: FormFieldProps<T>) {
  const { form, name, id, label, placeholder, autoComplete } = props;
  const hasError = Boolean(form.formState.errors[name]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <User
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-[15px] py-5 pl-10 shadow-sm"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...form.register(name)}
        />
      </div>
      <FieldError form={form} name={name} id={id} />
    </div>
  );
}

export function EmailField<T extends FieldValues>(props: FormFieldProps<T>) {
  const { form, name, id, label, placeholder, autoComplete } = props;
  const hasError = Boolean(form.formState.errors[name]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Mail
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-[15px] py-5 pl-10 shadow-sm"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...form.register(name)}
        />
      </div>
      <FieldError form={form} name={name} id={id} />
    </div>
  );
}

type PasswordFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function PasswordField<T extends FieldValues>(
  props: PasswordFieldProps<T>,
) {
  const {
    form,
    name,
    id,
    label,
    placeholder,
    autoComplete,
    showPassword,
    onTogglePassword,
  } = props;
  const hasError = Boolean(form.formState.errors[name]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <KeyRound
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 rounded-[15px] py-5 pl-10 pr-12 shadow-sm"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...form.register(name)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
      <FieldError form={form} name={name} id={id} />
    </div>
  );
}

"use client";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AppFormFieldProps {
  label: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AppFormField({
  label,
  description,
  className,
  children,
}: AppFormFieldProps) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <FormItem className={cn(className)}>
      <FormLabel htmlFor={fieldId}>{label}</FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface AppFieldGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function AppFieldGrid({
  children,
  cols = 2,
  className,
}: AppFieldGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-1 md:grid-cols-2": cols === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

"use client";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CusFormFieldProps {
  label: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CusFormField({
  label,
  description,
  className,
  children,
}: CusFormFieldProps) {
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

interface ModernFieldGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function ModernFieldGrid({
  children,
  cols = 2,
  className,
}: ModernFieldGridProps) {
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

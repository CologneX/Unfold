"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SelectResponsive({
  value,
  onChange,
  options,
  placeholder = "Select",
  ...props
}: {
  value: string | null;
  onChange: (value: string) => void;
  options: { value: string | null; label: string | React.ReactNode }[];
  placeholder?: string;
} & Omit<React.ComponentProps<typeof SelectTrigger>, "value" | "onChange">) {
  const [open, setOpen] = React.useState(false);
  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      defaultValue={value || null!}
      onValueChange={(value) => onChange(value || null!)}
    >
      <SelectTrigger className="w-full" {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value || null!}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

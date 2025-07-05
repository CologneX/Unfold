"use client";

import * as React from "react";
// import { Button } from "@/components/ui/button";
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
}: {
  value: string | null;
  onChange: (value: string) => void;
  options: { value: string | null; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      defaultValue={value || null!}
      onValueChange={(value) => onChange(value || null!)}
    >
      <SelectTrigger className="w-full">
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

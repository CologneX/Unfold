"use client";

import * as React from "react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

export function ComboBoxResponsive({
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  value: string | null;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            {value ? <>{value}</> : <>{placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <ComboBoxResponsiveList
            setOpen={setOpen}
            onChange={onChange}
            options={options}
            value={value}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {value ? <>{value}</> : <>{placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboBoxResponsiveList
            setOpen={setOpen}
            onChange={onChange}
            options={options}
            value={value}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ComboBoxResponsiveList({
  setOpen,
  onChange,
  options,
  value,
}: {
  setOpen: (open: boolean) => void;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  value: string | null;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                onChange(value);
                setOpen(false);
              }}
            >
              {option.label}
              {value === option.value && <Check className="ml-auto size-4" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

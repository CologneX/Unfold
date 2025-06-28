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
import { Check, ChevronDown } from "lucide-react";

export function SelectResponsive({
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
            <ChevronDown className="ml-auto size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <SelectResponsiveList
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
          <ChevronDown className="ml-auto size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <SelectResponsiveList
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

function SelectResponsiveList({
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

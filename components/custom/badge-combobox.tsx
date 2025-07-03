"use client";

import { CheckIcon, ChevronsUpDownIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState, useCallback, useMemo } from "react";
import { Badge } from "../ui/badge";
import { ComboboxItem } from "@/types/types";

interface BadgeComboboxProps {
  value: ComboboxItem[];
  data: ComboboxItem[];
  onChange: (value: ComboboxItem[]) => void;
  onAddNew?: (item: ComboboxItem) => Promise<void> | void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function BadgeCombobox({
  value = [],
  data = [],
  onChange,
  onAddNew,
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  searchPlaceholder = "Search items...",
  className,
  disabled = false,
}: BadgeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Filter out already selected items
  const availableItems = useMemo(() => 
    data.filter(
      (item) => !value.some((selected) => selected.value === item.value)
    ), [data, value]
  );

  // Filter items based on search
  const filteredItems = useMemo(() => 
    availableItems.filter((item: ComboboxItem) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    ), [availableItems, searchValue]
  );

  const handleSelect = useCallback(
    (selectedItem: ComboboxItem) => {
      const newValue = [...value, selectedItem];
      onChange(newValue);
      setSearchValue("");
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (itemToRemove: ComboboxItem, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const newValue = value.filter(
        (item) => item.value !== itemToRemove.value
      );
      onChange(newValue);
    },
    [value, onChange]
  );

  const handleAddNew = useCallback(
    async (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && searchValue.trim() && onAddNew) {
        event.preventDefault();
        const trimmedValue = searchValue.trim();

        // Check if item already exists in data or selected items
        const exists = [...data, ...value].some(
          (item) => item.label.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (!exists) {
          setIsAdding(true);
          try {
            const newItem: ComboboxItem = {
              value: trimmedValue.toLowerCase().replace(/\s+/g, "-"),
              label: trimmedValue,
            };

            await onAddNew(newItem);
            handleSelect(newItem);
          } catch (error) {
            console.error("Failed to add new item:", error);
          } finally {
            setIsAdding(false);
          }
        }
      }
    },
    [searchValue, onAddNew, data, value, handleSelect]
  );

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            type="button"
            className="w-full justify-start min-h-10 h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length > 0 ? (
                value.map((item) => (
                  <Badge
                    key={item.value}
                    className="flex items-center gap-1 pr-1"
                  >
                    <span>{item.label}</span>
                    <div
                      className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
                      onClick={(event) => handleRemove(item, event)}
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
              onKeyDown={handleAddNew}
              disabled={isAdding}
            />
            <CommandList>
              <CommandEmpty>
                {isAdding ? (
                  <div className="text-center py-4">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Adding...</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {emptyMessage}
                    </p>
                    {onAddNew && searchValue.trim() && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Press Enter to add &quot;{searchValue.trim()}&quot;
                      </p>
                    )}
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item: ComboboxItem) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Items Display */}
      {/* {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((item) => (
            <Badge
              key={item.value}
              variant="default"
              className="flex items-center gap-1 pr-1"
            >
              <span>{item.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(event) => handleRemove(item, event)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )} */}
    </div>
  );
}

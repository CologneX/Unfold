"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { JSX } from "react";

// use memo to memoize the component
const DatePicker = React.memo(
  ({
    value,
    onChange,
    className,
  }: {
    value: Date;
    onChange: (date: Date) => void;
    className?: string;
  }): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={cn("justify-between font-normal", className)}
            >
              {value ? formatDate(value) : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              required
              onSelect={(date: Date) => {
                onChange(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;

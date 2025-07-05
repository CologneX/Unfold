import {
  add,
  eachMonthOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isEqual,
  parse,
  startOfMonth,
  startOfToday,
} from "date-fns";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function getStartOfCurrentMonth() {
  return startOfMonth(startOfToday());
}

interface MonthPickerProps extends Omit<ButtonProps, "onClick" | "children"> {
  currentMonth?: Date;
  onMonthChange: (newMonth: Date) => void;
  minMonth?: Date;
  maxMonth?: Date;
}

export default function MonthPicker({
  currentMonth,
  onMonthChange,
  minMonth,
  maxMonth,
  ...triggerProps
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = React.useState<string | undefined>(
    currentMonth ? format(currentMonth, "yyyy") : undefined
  );
  const firstDayCurrentYear = currentYear
    ? parse(currentYear, "yyyy", new Date())
    : new Date();

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  });

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn("w-full justify-start", triggerProps?.className)}
          {...triggerProps}
          variant="outline"
        >
          <CalendarIcon className="mr-2 size-4" />
          {currentMonth ? format(currentMonth, "MMMM yyyy") : "Select Month"}
          <ChevronDown className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <div className="relative flex items-center justify-center pt-1">
            <div
              className="text-sm font-medium"
              aria-live="polite"
              role="presentation"
              id="month-picker"
            >
              {format(firstDayCurrentYear, "yyyy")}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                name="previous-year"
                size="icon"
                variant="outline"
                aria-label="Go to previous year"
                className={cn("absolute left-1 size-8")}
                type="button"
                onClick={previousYear}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                name="next-year"
                size="icon"
                variant="outline"
                aria-label="Go to next year"
                className={cn("absolute right-1 size-8")}
                type="button"
                onClick={nextYear}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
          <div
            className="grid w-full grid-cols-3 gap-2"
            role="grid"
            aria-labelledby="month-picker"
          >
            {months.map((month) => (
              <div
                key={month.toString()}
                className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                role="presentation"
              >
                <Button
                  name="day"
                  className={cn(
                    "inline-flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal",
                    currentMonth &&
                      isEqual(month, currentMonth) &&
                      "bg-primary text-primary-foreground",
                    currentMonth &&
                      !isEqual(month, currentMonth) &&
                      isEqual(month, getStartOfCurrentMonth()) &&
                      "bg-primary/30 text-primary"
                  )}
                  variant="ghost"
                  disabled={
                    (minMonth && isBefore(month, minMonth)) ||
                    (maxMonth && isAfter(month, maxMonth))
                  }
                  role="gridcell"
                  tabIndex={-1}
                  type="button"
                  onClick={() => onMonthChange(month)}
                >
                  <time dateTime={format(month, "yyyy-MM-dd")}>
                    {format(month, "MMM")}
                  </time>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

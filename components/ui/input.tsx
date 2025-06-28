import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  prefixLeft?: React.ReactNode
  prefixRight?: React.ReactNode
}

function Input({ className, type, prefixLeft, prefixRight, ...props }: InputProps) {
  const hasPrefix = prefixLeft || prefixRight

  if (!hasPrefix) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div className="flex w-full">
      {prefixLeft && (
        <div className={cn(
          "border-input bg-primary text-primary-foreground flex h-9 items-center border px-3 text-sm font-medium",
          "rounded-l-md border-r-0",
          !prefixRight && "focus-within:border-ring"
        )}>
          {prefixLeft}
        </div>
      )}
      
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // Adjust border radius based on prefixes
          prefixLeft && prefixRight && "rounded-none",
          prefixLeft && !prefixRight && "rounded-l-none rounded-r-md",
          !prefixLeft && prefixRight && "rounded-l-md rounded-r-none",
          className
        )}
        {...props}
      />
      
      {prefixRight && (
        <div className={cn(
          "border-input bg-primary text-primary-foreground flex h-9 items-center border px-3 text-sm font-medium",
          "rounded-r-md border-l-0",
          !prefixLeft && "focus-within:border-ring"
        )}>
          {prefixRight}
        </div>
      )}
    </div>
  )
}

export { Input }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CusFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CusFormSection({
  title,
  description,
  children,
  onAdd,
  addLabel = "Add Item",
  className,
  icon,
}: CusFormSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("group", className)}
    >
      <Card className="relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
              )}
              <div>
                <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                  {title}
                </CardTitle>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {onAdd && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="shrink-0 border-border/60 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{addLabel}</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

interface ModernFormItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  index?: number;
  title?: string;
  className?: string;
}

export function ModernFormItem({
  children,
  onDelete,
  index,
  title,
  className,
}: ModernFormItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group/item relative rounded-xl border border-border/30 bg-card/30 p-4 transition-all duration-200 hover:border-border/50 hover:bg-card/50",
        className
      )}
    >
      {/* Item header with delete button */}
      {(title || onDelete) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h4 className="font-medium text-foreground">
              {title} {index !== undefined && `#${index + 1}`}
            </h4>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-hover/item:opacity-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

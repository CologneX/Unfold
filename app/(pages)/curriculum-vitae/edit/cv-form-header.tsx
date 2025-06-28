"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStep {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
}

interface CVFormHeaderProps {
  title: string;
  description: string;
  currentStep?: number;
  steps?: FormStep[];
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function CVFormHeader({
  title,
  description,
  currentStep = 0,
  steps = [],
  isSubmitting,
  onSubmit,
}: CVFormHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Main header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Progress steps */}
        {steps.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 min-w-0"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                        index < currentStep
                          ? "border-primary bg-primary text-primary-foreground"
                          : index === currentStep
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <p className={cn(
                        "text-sm font-medium transition-colors",
                        index <= currentStep ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-8 transition-colors duration-300",
                        index < currentStep ? "bg-primary" : "bg-border"
                      )} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-center">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            size="lg"
            effect="shine"
            className="px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
                Updating CV...
              </>
            ) : (
              "Update CV"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 
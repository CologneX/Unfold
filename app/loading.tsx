"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function Loading({ size = 10 }: { size?: number }) {
  return (
    <AnimatePresence>
      <motion.div
        className="h-full w-full grid place-items-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Loader2
          className={cn("md:size-16 animate-spin text-primary", `size-${size}`)}
        />
      </motion.div>
    </AnimatePresence>
  );
}

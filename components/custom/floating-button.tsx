"use client";

import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { AnimatePresence, motion, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div className="absolute bottom-6 left-6 z-50 flex items-center justify-center gap-1">
      <motion.button
        style={{
          borderRadius: 12,
        }}
        whileTap={{
          scale: 0.9,
        }}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "icon",
            className: "hover:rounded-full",
          })
        )}
        type="button"
        onClick={() => {
          router.push("/curriculum-vitae/edit");
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <EditIcon />
      </motion.button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, type:"spring", bounce: 1, damping: 5, mass: 0.5 }}
            className={cn(
              badgeVariants({
                variant: "outline",
              })
            )}
          >
            Edit
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

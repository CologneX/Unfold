"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid3X3 } from "lucide-react";

export default function ProjectNavigation() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 z-50 lg:absolute lg:top-8 lg:left-8"
    >
      <Button
        asChild
        variant="secondary"
        className="group/btn relative overflow-hidden bg-card/80 hover:bg-card backdrop-blur-sm border border-border/40 text-foreground shadow-lg hover:shadow-xl"
      >
        <Link href="/projects">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover/btn:-translate-x-0.5" />
          All Projects
          <Grid3X3 className="h-3 w-3 ml-2 opacity-60" />
        </Link>
      </Button>
    </motion.div>
  );
} 
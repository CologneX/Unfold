"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Project } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Background Image */}
      {project.bannerUrl && (
        <div className="absolute inset-0">
          <Image
            src={project.bannerUrl}
            alt={project.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl space-y-6"
          >
            {/* Featured Badge */}
            {project.isFeatured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border/40 text-foreground"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Featured Project
                </Badge>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
            >
              {project.name}
            </motion.h1>

            {/* Short Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              {project.shortDescription}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
} 
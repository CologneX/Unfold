"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Project } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ExternalLink, Zap, Edit } from "lucide-react";
import { isDev } from "@/lib/utils";

interface ProjectActionsProps {
  project: Project;
}

export default function ProjectActions({ project }: ProjectActionsProps) {
  const hasActions = project.repositoryUrl || project.liveUrl || isDev();

  if (!hasActions) {
    return null;
  }

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isDev() && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              asChild
              className="w-full group/btn relative overflow-hidden bg-card hover:bg-accent border border-border/40 text-foreground flex items-center justify-start"
              icon={Edit}
              iconPlacement="left"
              variant="outline"
            >
              <Link href={`/project/${project.slug}/edit`} className="gap-4">Edit Project</Link>
            </Button>
          </motion.div>
        )}

        {project.repositoryUrl && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              asChild
              className="w-full group/btn relative overflow-hidden bg-card hover:bg-accent border border-border/40 text-foreground"
              variant="outline"
            >
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <Github className="h-4 w-4 mr-2" />
                View Source Code
                <ExternalLink className="h-3 w-3 ml-auto opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </a>
            </Button>
          </motion.div>
        )}

        {project.liveUrl && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              asChild
              className="w-full group/btn relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Project
                <ExternalLink className="h-3 w-3 ml-auto opacity-70 group-hover/btn:opacity-100 transition-opacity" />
              </a>
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

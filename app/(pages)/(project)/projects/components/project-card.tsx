import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  isActive?: boolean;
  className?: string;
}

export default function ProjectCard({
  project,
  isActive = true,
  className = "",
}: ProjectCardProps) {
  return (
    <div
      className={`relative h-[70vh] transition-all duration-700 ${className}`}
    >
      {/* Background Image */}
      {project.bannerUrl && (
        <div className="absolute inset-0">
          <Image
            src={project.bannerUrl}
            alt={project.name}
            fill
            className="object-cover"
            priority={isActive}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 rounded-3xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-end p-8 md:p-12">
        <div className="max-w-4xl space-y-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
          {/* Project Badge */}
          {project.isFeatured && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/40">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Featured Project</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {project.name}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Action Button */}
          <Link href={`/project/${project.slug}`}>
            <Button
              size="lg"
              className="group/btn relative overflow-hidden bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                Explore Project
                <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

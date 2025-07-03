import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectGridCardProps {
  project: Project;
  index?: number;
}

export default function ProjectGridCard({ project, index = 0 }: ProjectGridCardProps) {
  return (
    <Link href={`/project/${project.slug}`} className="group/grid-card">
      <Card
        className="relative overflow-hidden border border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-in fade-in-0 zoom-in-95"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover/grid-card:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10">
          {project.bannerUrl && (
            <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
              <Image
                src={project.bannerUrl}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-500 group-hover/grid-card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover/grid-card:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <CardTitle className="text-lg group-hover/grid-card:text-primary transition-colors duration-300">
            {project.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
} 
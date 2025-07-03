import { Project } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code, UserCheck, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectMetadataProps {
  project: Project;
}

export default function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Technologies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Code className="h-4 w-4" />
            Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Roles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserCheck className="h-4 w-4" />
            Role
          </div>
          <div className="flex flex-wrap gap-2">
            {project.role.map((role, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-border/40 text-foreground hover:bg-accent/40 transition-colors"
              >
                {role.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dates */}
        {(project.createdAt || project.updatedAt) && (
          <>
            <Separator className="bg-border/40" />
            <div className="space-y-3">
              {project.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground font-medium">
                    {formatDate(new Date(project.createdAt))}
                  </span>
                </div>
              )}
              {project.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground font-medium">
                    {formatDate(new Date(project.updatedAt))}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 
import { Project } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import RichTextDisplay from "@/components/custom/display-rich-editor";

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({ project }: ProjectContentProps) {

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground"
        />
        <RichTextDisplay content={project.description} />
      </CardContent>
    </Card>
  );
}

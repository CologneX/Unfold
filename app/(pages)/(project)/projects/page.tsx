import { listProjects } from "@/app/actions";
import Link from "next/link";
import { Project } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddProjectButton from "@/components/custom/add-project-button";
import { isDev } from "@/lib/utils";
import Image from "next/image";
import { memo } from "react";

const ProjectCard = memo(({ project }: { project: Project }) => {
  return (
    <Link href={`/project/${project.slug}`} className="w-full">
      <Card className="hover:scale-105 transition-all duration-300 w-full">
        <CardHeader>
          {project.bannerUrl && (
            <Image
              src={project.bannerUrl}
              alt={project.name}
              width={1000}
              height={1000}
              className="w-full h-48 object-cover"
            />
          )}
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.shortDescription}</p>
        </CardContent>
      </Card>
    </Link>
  );
});

export default async function Projects() {
  const projects = await listProjects();
  return (
    <div className="gap-4 h-full flex flex-col items-center relative">
      <div className="flex flex-col gap-4 max-w-xl w-full p-2 md:p-0 md:py-2">
        {isDev() && <AddProjectButton />}
      </div>
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg font-semibold">Oh no! No projects found</p>
          <p className="text-sm text-muted-foreground">
            Create a project to show them here.
          </p>
        </div>
      )}
    </div>
  );
}

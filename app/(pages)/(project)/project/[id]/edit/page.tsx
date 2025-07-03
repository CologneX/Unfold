import { listRoles, listTechnologies, readProject } from "@/app/actions";
import ProjectEditForm from "./form";

export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const [technologies, roles, project] = await Promise.all([
      listTechnologies(),
      listRoles(),
      readProject(id),
    ]);
    if (!project) {
      return <div>Project not found</div>;
    }
    return (
      <div className="max-w-4xl mx-auto pt-24 pb-4 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Project {project.name}</h1>
          <p className="text-muted-foreground mt-2">
            Edit the project {project.name} with all the relevant details.
          </p>
        </div>

        <ProjectEditForm
          project={project}
          technologies={technologies}
          roles={roles}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load technologies or roles:", error);
    return <div>Error loading technologies or roles</div>;
  }
}

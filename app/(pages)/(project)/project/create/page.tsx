import { listRoles, listTechnologies } from "@/app/actions";
import ProjectCreateForm from "./form";

export default async function CreateProject() {
  try {
    const [technologies, roles] = await Promise.all([
      listTechnologies(),
      listRoles(),
    ]);
    return (
      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Add a new project to your portfolio with all the relevant details.
          </p>
        </div>

        <ProjectCreateForm technologies={technologies} roles={roles} />
      </div>
    );
  } catch (error) {
    console.error("Failed to load technologies or roles:", error);
    return <div>Error loading technologies or roles</div>;
  }
}

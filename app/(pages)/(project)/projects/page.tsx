import { listProjects } from "@/app/actions";
import { isDev } from "@/lib/utils";
import ProjectCarousel from "@/components/custom/project-carousel";
import ProjectEmptyState from "@/components/custom/project-empty-state";
import ProjectGridCard from "@/components/custom/project-grid-card";
import ProjectAddCard from "@/components/custom/project-add-card";

export default async function Projects() {
  const projects = await listProjects();

  return (
    <div className="relative pt-12">
              {/* Main Content */}
        <div className="relative z-10 py-12">
          {projects.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <ProjectEmptyState />
            </div>
          ) : (
            <div className="w-full space-y-8">
              {/* Header Section */}
              <div className="max-w-4xl mx-auto text-center space-y-4 animate-in fade-in-0 slide-in-from-top-6 duration-700">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-lg blur-xl opacity-60 animate-pulse" />
                  <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                    Projects
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Explore a collection of innovative projects showcasing creativity,
                  technical expertise, and passion for development.
                </p>
              </div>

              {/* Carousel Container - Full Width */}
              <ProjectCarousel projects={projects} />

              {/* Project Grid (Secondary View) */}
              {projects.length > 3 && (
                <div className="max-w-4xl mx-auto mt-16 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-foreground/90 mb-2">
                      All Projects
                    </h2>
                    <p className="text-muted-foreground">
                      Browse through the complete collection
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <ProjectGridCard
                        key={project.slug}
                        project={project}
                        index={index}
                      />
                    ))}
                    {isDev() && <ProjectAddCard index={projects.length} />}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

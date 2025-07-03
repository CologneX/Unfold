import { notFound } from "next/navigation";
import { Metadata } from "next";
import { readProject } from "@/app/actions";
import ProjectHero from "./components/project-hero";
import ProjectNavigation from "./components/project-navigation";
import ProjectContent from "./components/project-content";
import ProjectMetadata from "./components/project-metadata";
import ProjectActions from "./components/project-actions";
import ProjectGallery from "./components/project-gallery";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await readProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.name} | Project Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: project.name,
      description: project.shortDescription,
      images: project.bannerUrl ? [{ url: project.bannerUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.shortDescription,
      images: project.bannerUrl ? [project.bannerUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await readProject(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Navigation */}
      <ProjectNavigation />

      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ProjectContent project={project} />
          </div>
          <div className="space-y-8">
            <ProjectMetadata project={project} />
            <ProjectActions project={project} />
          </div>
        </div>

        {/* Project Gallery */}
        {project.imageUrl && project.imageUrl.length > 0 && (
          <ProjectGallery
            images={project.imageUrl}
            projectName={project.name}
          />
        )}
      </div>
    </>
  );
}

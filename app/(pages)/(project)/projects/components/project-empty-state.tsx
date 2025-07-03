import { FolderOpen } from "lucide-react";
import AddProjectButton from "@/components/custom/add-project-button";
import { isDev } from "@/lib/utils";

export default function ProjectEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
      {/* Empty State with Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-full p-8">
          <FolderOpen className="h-16 w-16 text-muted-foreground/60" />
        </div>
      </div>
      <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <h3 className="text-2xl font-semibold text-foreground/90">
          No Projects Yet
        </h3>
        <p className="text-muted-foreground max-w-md">
          Create your first project to showcase your amazing work and bring
          your ideas to life.
        </p>
      </div>
      {isDev() && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
          <AddProjectButton />
        </div>
      )}
    </div>
  );
} 
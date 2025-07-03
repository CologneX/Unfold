import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface ProjectAddCardProps {
  index?: number;
}

export default function ProjectAddCard({ index = 0 }: ProjectAddCardProps) {
  return (
    <Link href={`/project/create`} className="group/grid-card">
      <Card
        className="relative overflow-hidden border-2 border-dashed border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-in fade-in-0 zoom-in-95 h-full"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover/grid-card:opacity-100 transition-opacity duration-500" />

        <CardContent className="flex flex-col items-center justify-center z-10 h-full">
          <Plus className="size-8" />
          <p className="text-muted-foreground text-sm leading-relaxed font-semibold md:text-xl">
            Add Project
          </p>
        </CardContent>
      </Card>
    </Link>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Project } from "@/types/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "@/components/custom/project-card";
interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Motion values for smooth animations
  const x = useMotionValue(0);
  const cardWidth = 80; // 80vw per card

  // Animate to new position when currentIndex changes
  useEffect(() => {
    const baseOffset = 10; // 10vw base offset to center first card
    const targetPosition = baseOffset - (currentIndex * cardWidth);
    
    animate(x, targetPosition, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.7
    });
  }, [currentIndex, x]);

  useEffect(() => {
    if (!isAutoPlaying || projects.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative group/carousel w-full overflow-hidden">
      {/* Main Carousel */}
      <div className="relative">
        <motion.div
          className="flex"
          style={{ 
            x: useTransform(x, (value) => `${value}vw`),
            willChange: "transform"
          }}
        >
          {projects.map((project, index) => (
            <motion.div 
              key={project.slug} 
              className="w-[80vw] flex-shrink-0"
              initial={{ scale: 0.95 }}
              animate={{ 
                scale: index === currentIndex ? 1 : 0.95 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 5,
                mass: 0.5
              }}
            >
              <ProjectCard
                project={project}
                isActive={index === currentIndex}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        {projects.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card/90 hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/40 hover:bg-card/90 hover:scale-110 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center space-x-3 mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 h-3 bg-primary rounded-full"
                  : "w-3 h-3 bg-muted-foreground/40 rounded-full hover:bg-muted-foreground/60"
              }`}
            >
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/40 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

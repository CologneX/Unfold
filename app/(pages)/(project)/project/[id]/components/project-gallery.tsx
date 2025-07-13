"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, ZoomIn } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
}

export default function ProjectGallery({
  images,
  projectName,
}: ProjectGalleryProps) {
  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            Project Gallery
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-primary/10 border-primary/20 text-primary"
          >
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
              className="group relative aspect-video rounded-lg overflow-hidden bg-muted"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-full cursor-pointer">
                    <Image
                      src={image}
                      alt={`${projectName} screenshot ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Image number badge */}
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
                      {index + 1}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent
                  className="max-w-4xl w-full p-0 bg-transparent border-0"
                  aria-describedby={undefined}
                >
                  <DialogTitle className="sr-only">{`${projectName} screenshot ${
                    index + 1
                  }`}</DialogTitle>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image}
                      alt={`${projectName} screenshot ${index + 1}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

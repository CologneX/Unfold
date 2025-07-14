"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { deleteImage, uploadImage } from "@/app/actions";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onDelete?: () => void;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onDelete,
  accept = "image/*",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = async () => {
    try {
      if (onDelete) {
        onDelete();
      }
      if (value) {
        await deleteImage(value);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      if (!onDelete) {
        onChange("");
      }
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* File Upload Area*/}
      <Card
        className={`
          relative border-2 border-dashed text-center cursor-pointer transition-colors p-1 w-80 h-32
          group
          ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }
          ${
            isUploading
              ? "opacity-50 pointer-events-none"
              : "hover:border-primary hover:bg-primary/5"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            removeImage();
          }}
        >
          <X className="size-4" />
        </Button>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md w-full">
            {error}
          </div>
        )}
        {value && !isUploading ? (
          <div className="relative group size-full">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain"
              onError={() => setError("Failed to load image")}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            {isUploading ? (
              <>
                <Loader2 className="animate-spin h-8 w-8" />
                <p className="text-sm text-muted-foreground">Uploading</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </Card>
    </>
  );
}

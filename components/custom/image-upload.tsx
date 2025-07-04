"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/app/actions";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
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

  const removeImage = () => {
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* File Upload Area with Integrated Preview */}
      <Card
        className={`
          relative border-2 border-dashed text-center cursor-pointer transition-colors p-1 w-80 h-32
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
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
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

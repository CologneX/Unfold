"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { readCV } from "@/app/actions";
import CVDocument from "./doc-cv";
import { pdf } from "@react-pdf/renderer";

const PdfDownloadButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const cvData = await readCV();
      if (!cvData) {
        throw new Error("CV data not found");
      }
      const blob = await pdf(<CVDocument data={cvData} />).toBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${cvData.profile.name}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading}
      className="relative overflow-hidden bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 group"
      onClick={onDownloadPdf}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      <Download className="h-4 w-4 mr-2" />
      CV
    </Button>
  );
};

export default PdfDownloadButton;

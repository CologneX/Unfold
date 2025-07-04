"use client";
import { Button } from "@/components/ui/button";
import { OctagonXIcon } from "lucide-react";
import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="grid place-items-center h-full">
      <div className="flex flex-col items-center gap-0">
        <OctagonXIcon className="size-24 text-destructive" />
        <div className="text-lg md:text-2xl font-bold mt-8">
          {error.message}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground text-center">
          Please edit the profile and CV data{" "}
          <Link href="/edit">
            <Button variant="link" className="p-0 font-bold h-fit">
              here
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

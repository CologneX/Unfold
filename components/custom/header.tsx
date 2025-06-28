import { cn } from "@/lib/utils";
import { JSX, Suspense } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import HeaderButtons from "./header-buttons";
import Loading from "@/app/loading";

export default function Header(): JSX.Element {
  return (
    <div
      className={cn(
        `w-full rounded-xl flex items-center justify-center bg-accent/40 border max-w-xl mx-auto h-16 backdrop-blur-xs px-4`
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center">
          <Suspense fallback={<Loading size={2} />}>
            <HeaderButtons />
          </Suspense>
        </div>
        <Button
          icon={Download}
          iconPlacement="left"
          variant="ghost"
          size="sm"
          effect="underline"
          className="font-bold"
        >
          CV
        </Button>
      </div>
    </div>
  );
}

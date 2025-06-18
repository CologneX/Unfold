"use client";
import { JSX } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

import { usePathname } from "next/navigation";

export default function HeaderButtons(): JSX.Element {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCv = pathname.includes("/curriculum-vitae");
  const isProjects = pathname.includes("/projects");

  return (
    <>
      <Link href="/" className={isHome ? "text-primary" : ""}>
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          Home
        </Button>
      </Link>
      <Link href="/curriculum-vitae" className={isCv ? "text-primary" : ""}>
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          CV
        </Button>
      </Link>
      <Link href="/projects" className={isProjects ? "text-primary" : ""}>
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          Portfolio
        </Button>
      </Link>
    </>
  );
}

"use client";
import { JSX } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

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
          asChild
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </motion.div>
        </Button>
      </Link>
      <Link href="/curriculum-vitae" className={isCv ? "text-primary" : ""}>
        <Button
          asChild
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
          >
            CV
          </motion.div>
        </Button>
      </Link>
      <Link href="/projects" className={isProjects ? "text-primary" : ""}>
        <Button
          asChild
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
          >
            Projects
          </motion.div>
        </Button>
      </Link>
    </>
  );
}

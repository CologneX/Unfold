"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { memo, motion } from "motion/react";
import Link from "next/link";

const AddProjectButton = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ y: -5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="sticky top-0"
    >
      <Button
        variant="outline"
        icon={Plus}
        iconPlacement="left"
        className="w-full"
        asChild
        effect="shineHover"
      >
        <Link href="/project/create">Create Project</Link>
      </Button>
    </motion.div>
  );
});

export default AddProjectButton;

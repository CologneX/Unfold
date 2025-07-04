"use client";

import { cn, isDev } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Download, Menu, X, Edit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PdfDownloadButton from "./pdf-download-button";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.includes(href));

  return (
    <>
      {/* Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex w-full max-w-xl mx-auto"
      >
        <div className="w-full rounded-2xl bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.includes(item.href));

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "relative font-medium transition-all duration-300 hover:bg-primary/10",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Edit Profile Button - Development Only */}
              {isDev() && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="relative overflow-hidden group"
                    icon={Edit}
                    iconPlacement="left"
                    effect="shineHover"
                  >
                    <Link href="/edit">Edit Profile</Link>
                  </Button>
                </motion.div>
              )}

              {/* CV Download Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <PdfDownloadButton />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Mobile Trigger Button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="sm"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-haspopup="true"
              className={cn(
                "relative w-12 h-12 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl shadow-black/10 transition-all duration-300",
                isOpen && "bg-card/60 border-primary/20"
              )}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="absolute top-full right-0 mt-2 origin-top-right"
                role="menu"
                aria-orientation="vertical"
              >
                {/* Liquid Glass Connector */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute top-0 right-6 w-6 h-3 bg-gradient-to-b from-card/60 to-card/40 backdrop-blur-xl border-l border-r border-border/40 rounded-b-md"
                  style={{ transformOrigin: "top" }}
                />

                {/* Menu Container */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="w-56 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl shadow-black/20 overflow-hidden"
                >
                  {/* Navigation Items */}
                  <div className="p-3 space-y-1">
                    {navigationItems.map((item, index) => {
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1,
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            >
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start font-medium transition-all duration-200",
                                  isActive(item.href)
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {item.name}
                              </Button>
                            </motion.div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Edit Profile Button - Development Only */}
                  {isDev() && (
                    <>
                      <div className="mx-3 border-t border-border/40" />
                      <div className="p-3">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: navigationItems.length * 0.1,
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link
                            href="/edit"
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            >
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start font-medium transition-all duration-200",
                                  isActive("/edit")
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                )}
                              >
                                Edit Profile
                              </Button>
                            </motion.div>
                          </Link>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Separator */}
                  <div className="mx-3 border-t border-border/40" />

                  {/* CV Download */}
                  <div className="p-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: navigationItems.length * 0.1,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <Button className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 group relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Backdrop - Invisible click area only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-transparent z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

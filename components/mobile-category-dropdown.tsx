"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

interface MobileCategoryDropdownProps {
  category: Category;
  label: string;
  onClose: () => void;
}

export function MobileCategoryDropdown({ category, label, onClose }: MobileCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const subcategories = SUBCATEGORIES[category];

  const handleClose = () => {
    setIsOpen(false);
    setExpandedSubcategory(null);
    onClose();
  };

  const getCategoryPath = () => {
    return `/${category === "clinico" ? "equipamientos-medicos" : "equipamiento-veterinario"}`;
  };

  const getCategoryPathWithSubcategory = (slug: string, slug2?: string) => {
    let path = `/${category === "clinico" ? "equipamientos-medicos" : "equipamiento-veterinario"}?subcategory=${slug}`;
    if (slug2) {
      path += `&subcategory2=${slug2}`;
    }
    return path;
  };

  return (
    <div className="py-2">
      {/* Main category link + toggle button */}
      <div className="flex items-center justify-between">
        <Link
          href={getCategoryPath()}
          onClick={handleClose}
          className="flex-1 px-3 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200 font-medium"
        >
          {label}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-3 text-white/80 hover:text-white transition-colors duration-200"
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Submenu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4"
          >
            <div className="py-2 space-y-1">
              {/* Subcategorías con soporte para items anidados */}
              {subcategories.map((sub) => (
                <div key={sub.slug}>
                  {sub.items && sub.items.length > 0 ? (
                    // Subcategoría con items anidados
                    <div>
                      <Link
                        href={getCategoryPathWithSubcategory(sub.slug)}
                        onClick={handleClose}
                        className="flex items-center justify-between w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedSubcategory(
                              expandedSubcategory === sub.slug ? null : sub.slug
                            );
                          }}
                          className="p-1"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              expandedSubcategory === sub.slug ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </Link>

                      {/* Submenu anidado */}
                      <AnimatePresence>
                        {expandedSubcategory === sub.slug && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden pl-4"
                          >
                            <div className="py-1 space-y-1">
                              {sub.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={getCategoryPathWithSubcategory(sub.slug, item.slug)}
                                  onClick={handleClose}
                                  className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer text-sm"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Subcategoría simple sin items anidados
                    <Link
                      href={getCategoryPathWithSubcategory(sub.slug)}
                      onClick={handleClose}
                      className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer"
                    >
                      {sub.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const subcategories = SUBCATEGORIES[category];

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const getCategoryPath = () => {
    return `/${category === "clinico" ? "equipamientos-clinicos" : "equipamiento-veterinario"}`;
  };

  const getCategoryPathWithSubcategory = (slug: string) => {
    return `/${category === "clinico" ? "equipamientos-clinicos" : "equipamiento-veterinario"}?subcategory=${slug}`;
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
              {/* Subcategorías */}
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={getCategoryPathWithSubcategory(sub.slug)}
                  onClick={handleClose}
                  className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

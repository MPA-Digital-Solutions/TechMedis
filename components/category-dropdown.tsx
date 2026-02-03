"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

interface CategoryDropdownProps {
  category: Category;
  label: string;
  pathname?: string;
}

export function CategoryDropdown({ category, label, pathname }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subcategories = SUBCATEGORIES[category];
  
  const getCategoryPath = () => {
    return category === "clinico" ? "/equipamientos-clinicos" : "/equipamiento-veterinario";
  };
  
  const isCategoryActive = pathname === getCategoryPath();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const getCategoryPathWithSubcategory = (slug: string) => {
    return `${getCategoryPath()}?subcategory=${slug}`;
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Link clickeable con dropdown */}
      <Link
        href={getCategoryPath()}
        className={`text-sm font-medium transition-colors duration-300 relative py-2 inline-flex items-center gap-1 cursor-pointer ${
          isCategoryActive
            ? "text-white"
            : "text-white/80 hover:text-white"
        }`}
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        {isCategoryActive && (
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
          />
        )}
      </Link>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 w-48 bg-techmedis-secondary rounded-lg shadow-xl overflow-hidden z-50"
          >
            <div className="py-2">
              {/* Ver todas */}
              <Link
                href={getCategoryPath()}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white/90 hover:bg-white/10 transition-colors duration-200 font-medium cursor-pointer"
              >
                Ver todas
              </Link>

              <div className="border-t border-white/10 my-1" />

              {/* Subcategorías */}
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={getCategoryPathWithSubcategory(sub.slug)}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
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

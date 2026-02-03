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
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subcategories = SUBCATEGORIES[category];
  
  const getCategoryPath = () => {
    return category === "clinico" ? "/equipamientos-medicos" : "/equipamiento-veterinario";
  };
  
  const isCategoryActive = pathname === getCategoryPath();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setExpandedSubcategory(null);
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
      setExpandedSubcategory(null);
    }, 150);
  };

  const getCategoryPathWithSubcategory = (slug: string, slug2?: string) => {
    let path = `${getCategoryPath()}?subcategory=${slug}`;
    if (slug2) {
      path += `&subcategory2=${slug2}`;
    }
    return path;
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
            className="absolute top-full left-0 mt-1 min-w-max bg-techmedis-secondary rounded-lg shadow-xl overflow-visible z-50"
          >
            <div className="py-2">
              {/* Subcategorías con soporte para items anidados */}
              {subcategories.map((sub) => (
                <div key={sub.slug}>
                  {sub.items && sub.items.length > 0 ? (
                    // Subcategoría con items anidados
                    <div
                      onMouseEnter={() => setExpandedSubcategory(sub.slug)}
                      onMouseLeave={() => setExpandedSubcategory(null)}
                      className="relative"
                    >
                      <Link
                        href={getCategoryPathWithSubcategory(sub.slug)}
                        onClick={() => {
                          setIsOpen(false);
                          setExpandedSubcategory(null);
                        }}
                        className="flex items-center justify-between w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
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
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-full top-0 ml-1 min-w-max bg-techmedis-secondary rounded-lg shadow-xl z-50"
                          >
                            <div className="py-2">
                              {sub.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={getCategoryPathWithSubcategory(sub.slug, item.slug)}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setExpandedSubcategory(null);
                                  }}
                                  className="block px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer text-sm"
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
                      onClick={() => {
                        setIsOpen(false);
                        setExpandedSubcategory(null);
                      }}
                      className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
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

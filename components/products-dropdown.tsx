"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, SUBCATEGORIES, type Category } from "@/lib/categories";

interface ProductsDropdownProps {
    pathname?: string;
}

export function ProductsDropdown({ pathname }: ProductsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isProductsActive = pathname?.startsWith("/productos");

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setExpandedCategory(null);
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
            setExpandedCategory(null);
            setExpandedSubcategory(null);
        }, 150);
    };

    const getCategoryPath = (category: Category, subcategory?: string, subcategory2?: string) => {
        let path = `/productos/${category}`;
        if (subcategory) {
            path += `?subcategory=${subcategory}`;
            if (subcategory2) {
                path += `&subcategory2=${subcategory2}`;
            }
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
            {/* Button clickeable con dropdown */}
            <button
                onClick={() => {
                    setIsOpen(false);
                    if (typeof window !== 'undefined') {
                        const section = document.getElementById('catalogo-section');
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }}
                className={`text-sm font-medium transition-colors duration-300 relative py-2 inline-flex items-center gap-1 cursor-pointer ${isProductsActive
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                    }`}
            >
                Productos
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
                {isProductsActive && (
                    <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    />
                )}
            </button>

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
                            {/* Categorías principales */}
                            {CATEGORIES.map((category) => {
                                const subcategories = SUBCATEGORIES[category];
                                const hasSubcategories = subcategories && subcategories.length > 0;

                                return (
                                    <div key={category}>
                                        {hasSubcategories ? (
                                            // Categoría con subcategorías
                                            <div
                                                onMouseEnter={() => setExpandedCategory(category)}
                                                onMouseLeave={() => {
                                                    setExpandedCategory(null);
                                                    setExpandedSubcategory(null);
                                                }}
                                                className="relative"
                                            >
                                                <Link
                                                    href={getCategoryPath(category)}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setExpandedCategory(null);
                                                        setExpandedSubcategory(null);
                                                    }}
                                                    className="flex items-center justify-between w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
                                                >
                                                    <span>{CATEGORY_LABELS[category]}</span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-200 -rotate-90`}
                                                    />
                                                </Link>

                                                {/* Submenu de subcategorías */}
                                                <AnimatePresence>
                                                    {expandedCategory === category && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="absolute left-full top-0 ml-1 min-w-max bg-techmedis-secondary rounded-lg shadow-xl z-50"
                                                        >
                                                            <div className="py-2">
                                                                {subcategories.map((sub) => (
                                                                    <div key={sub.slug}>
                                                                        {sub.items && sub.items.length > 0 ? (
                                                                            // Subcategoría con items anidados (nivel 2)
                                                                            <div
                                                                                onMouseEnter={() => setExpandedSubcategory(sub.slug)}
                                                                                onMouseLeave={() => setExpandedSubcategory(null)}
                                                                                className="relative"
                                                                            >
                                                                                <Link
                                                                                    href={getCategoryPath(category, sub.slug)}
                                                                                    onClick={() => {
                                                                                        setIsOpen(false);
                                                                                        setExpandedCategory(null);
                                                                                        setExpandedSubcategory(null);
                                                                                    }}
                                                                                    className="flex items-center justify-between w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer text-sm"
                                                                                >
                                                                                    <span>{sub.name}</span>
                                                                                    <ChevronDown
                                                                                        size={12}
                                                                                        className="-rotate-90"
                                                                                    />
                                                                                </Link>

                                                                                {/* Submenu nivel 2 */}
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
                                                                                                        href={getCategoryPath(category, sub.slug, item.slug)}
                                                                                                        onClick={() => {
                                                                                                            setIsOpen(false);
                                                                                                            setExpandedCategory(null);
                                                                                                            setExpandedSubcategory(null);
                                                                                                        }}
                                                                                                        className="block px-4 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer text-sm"
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
                                                                            // Subcategoría simple
                                                                            <Link
                                                                                href={getCategoryPath(category, sub.slug)}
                                                                                onClick={() => {
                                                                                    setIsOpen(false);
                                                                                    setExpandedCategory(null);
                                                                                    setExpandedSubcategory(null);
                                                                                }}
                                                                                className="block px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer text-sm"
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
                                        ) : (
                                            // Categoría simple sin subcategorías
                                            <Link
                                                href={getCategoryPath(category)}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setExpandedCategory(null);
                                                }}
                                                className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer"
                                            >
                                                {CATEGORY_LABELS[category]}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

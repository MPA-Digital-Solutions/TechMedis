"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CATEGORIES, CATEGORY_LABELS, SUBCATEGORIES, type Category } from "@/lib/categories";

interface MobileProductsDropdownProps {
    onClose: () => void;
}

export function MobileProductsDropdown({ onClose }: MobileProductsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

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
        <div className="space-y-1">
            {/* Header - Productos */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-3 px-2 text-base font-medium rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
                <span>Productos</span>
                <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Categorías principales */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pl-4 space-y-1">
                            {CATEGORIES.map((category) => {
                                const subcategories = SUBCATEGORIES[category];
                                const hasSubcategories = subcategories && subcategories.length > 0;

                                return (
                                    <div key={category}>
                                        {hasSubcategories ? (
                                            // Categoría con subcategorías
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => setExpandedCategory(
                                                        expandedCategory === category ? null : category
                                                    )}
                                                    className="flex items-center justify-between w-full py-2 px-2 text-sm font-medium rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200"
                                                >
                                                    <span>{CATEGORY_LABELS[category]}</span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${expandedCategory === category ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                                {/* Subcategorías */}
                                                <AnimatePresence>
                                                    {expandedCategory === category && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 space-y-1">

                                                                {subcategories.map((sub) => (
                                                                    <div key={sub.slug}>
                                                                        {sub.items && sub.items.length > 0 ? (
                                                                            // Subcategoría con items anidados
                                                                            <div className="space-y-1">
                                                                                <button
                                                                                    onClick={() => setExpandedSubcategory(
                                                                                        expandedSubcategory === sub.slug ? null : sub.slug
                                                                                    )}
                                                                                    className="flex items-center justify-between w-full py-2 px-2 text-sm text-white/60 hover:bg-white/10 hover:text-white rounded-md transition-colors duration-200"
                                                                                >
                                                                                    <span>{sub.name}</span>
                                                                                    <ChevronDown
                                                                                        size={14}
                                                                                        className={`transition-transform duration-200 ${expandedSubcategory === sub.slug ? "rotate-180" : ""
                                                                                            }`}
                                                                                    />
                                                                                </button>

                                                                                {/* Items nivel 2 */}
                                                                                <AnimatePresence>
                                                                                    {expandedSubcategory === sub.slug && (
                                                                                        <motion.div
                                                                                            initial={{ opacity: 0, height: 0 }}
                                                                                            animate={{ opacity: 1, height: "auto" }}
                                                                                            exit={{ opacity: 0, height: 0 }}
                                                                                            transition={{ duration: 0.15 }}
                                                                                            className="overflow-hidden"
                                                                                        >
                                                                                            <div className="pl-4 space-y-1">
                                                                                                {sub.items.map((item) => (
                                                                                                    <Link
                                                                                                        key={item.slug}
                                                                                                        href={getCategoryPath(category, sub.slug, item.slug)}
                                                                                                        onClick={onClose}
                                                                                                        className="block py-2 px-2 text-xs text-white/50 hover:bg-white/10 hover:text-white rounded-md transition-colors duration-200"
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
                                                                                onClick={onClose}
                                                                                className="block py-2 px-2 text-sm text-white/60 hover:bg-white/10 hover:text-white rounded-md transition-colors duration-200"
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
                                                onClick={onClose}
                                                className="block py-2 px-2 text-sm font-medium rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200"
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

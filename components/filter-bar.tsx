"use client";

import { motion } from "framer-motion";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function FilterBar({ categories, selectedCategory, onSelectCategory }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onSelectCategory("all")}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          selectedCategory === "all"
            ? "bg-techmedis-primary text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            selectedCategory === category
              ? "bg-techmedis-primary text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}

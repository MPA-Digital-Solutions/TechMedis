"use client";

import { useRouter } from "next/navigation";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

interface SubcategoryFilterClientProps {
  category: Category;
  currentSubcategory?: string;
}

export function SubcategoryFilterClient({ category, currentSubcategory }: SubcategoryFilterClientProps) {
  const router = useRouter();
  const subcategories = SUBCATEGORIES[category];

  const handleFilterChange = (slug: string | null) => {
    if (slug) {
      router.push(`?subcategory=${slug}`);
    } else {
      // Limpiar el filtro completamente
      router.push(
        `/${category === "clinico" ? "equipamientos-clinicos" : "equipamiento-veterinario"}`
      );
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Ver todas */}
      <button
        onClick={() => handleFilterChange(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
          !currentSubcategory
            ? "bg-techmedis-primary text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Ver todas
      </button>

      {/* Filtros por subcategoría */}
      {subcategories.map((sub) => (
        <button
          key={sub.slug}
          onClick={() => handleFilterChange(sub.slug)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
            currentSubcategory === sub.slug
              ? "bg-techmedis-primary text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}

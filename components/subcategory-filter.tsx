"use client";

import { useRouter } from "next/navigation";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

interface SubcategoryFilterProps {
  category: Category;
}

export function SubcategoryFilter({ category }: SubcategoryFilterProps) {
  const router = useRouter();
  const subcategories = SUBCATEGORIES[category];

  const handleFilterChange = (slug: string | null) => {
    if (slug) {
      router.push(`?subcategory=${slug}`, { scroll: false });
    } else {
      // Limpiar el filtro completamente - ir a la URL sin parámetros
      router.push(
        `/${category === "clinico" ? "equipamientos-medicos" : "equipamiento-veterinario"}`,
        { scroll: false }
      );
    }
  };

  // Obtener parámetro actual de la URL (SSR-safe)
  const currentSubcategory = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get("subcategory")
    : null;

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* Ver todas */}
      <button
        onClick={() => handleFilterChange(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
          !currentSubcategory
            ? "bg-techmedis-primary text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
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

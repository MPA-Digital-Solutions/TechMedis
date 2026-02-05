"use client";

import { useRouter } from "next/navigation";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

interface SubcategoryFilterClientProps {
  category: Category;
  currentSubcategory?: string;
  currentSubcategory2?: string;
}

export function SubcategoryFilterClient({ category, currentSubcategory, currentSubcategory2 }: SubcategoryFilterClientProps) {
  const router = useRouter();
  const subcategories = SUBCATEGORIES[category];

  // Obtener la subcategoría actual con sus items
  const selectedSubcategoryObj = currentSubcategory
    ? subcategories.find((sub) => sub.slug === currentSubcategory)
    : null;

  const hasNestedItems = selectedSubcategoryObj?.items && selectedSubcategoryObj.items.length > 0;

  const handleFilterChange = (slug: string | null, slug2?: string | null) => {
    const categoryPath = `/productos/${category}`;

    if (slug) {
      let path = `${categoryPath}?subcategory=${slug}`;
      // Solo agregar subcategory2 si se proporciona explícitamente
      if (slug2 !== undefined && slug2 !== null) {
        path += `&subcategory2=${slug2}`;
      }
      router.push(path, { scroll: false });
    } else {
      // Limpiar el filtro completamente
      router.push(categoryPath, { scroll: false });
    }
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Filtros de Subcategoría Nivel 1 */}
      <div className="flex flex-wrap gap-3">
        {/* Ver todas */}
        <button
          onClick={() => handleFilterChange(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${!currentSubcategory
            ? "bg-techmedis-primary text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Ver todas
        </button>

        {/* Filtros por subcategoría nivel 1 */}
        {subcategories.map((sub) => (
          <button
            key={sub.slug}
            onClick={() => handleFilterChange(sub.slug)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${currentSubcategory === sub.slug
              ? "bg-techmedis-primary text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {sub.name}
            {sub.items && sub.items.length > 0 && (
              <span className="ml-2 text-xs">▼</span>
            )}
          </button>
        ))}
      </div>

      {/* Filtros de Subcategoría Nivel 2 (si hay items anidados) */}
      {hasNestedItems && (
        <div className="flex flex-wrap gap-3 pl-4 border-l-4 border-techmedis-primary">
          {/* Opción para solo esta subcategoría nivel 1 */}
          <button
            onClick={() => handleFilterChange(currentSubcategory ?? null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer text-sm ${currentSubcategory && !currentSubcategory2
              ? "bg-techmedis-secondary text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {selectedSubcategoryObj?.name} (todos)
          </button>

          {/* Filtros por subcategoría nivel 2 */}
          {selectedSubcategoryObj?.items?.map((item) => (
            <button
              key={item.slug}
              onClick={() => handleFilterChange(currentSubcategory ?? null, item.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer text-sm ${currentSubcategory2 === item.slug
                ? "bg-techmedis-secondary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

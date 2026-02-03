/**
 * Configuración centralizada de categorías y subcategorías
 * Este archivo contiene toda la estructura de categorías con soporte para niveles múltiples
 */

export const CATEGORIES = ["clinico", "veterinario"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  clinico: "Equipamiento Médico",
  veterinario: "Veterinario",
};

/**
 * Subcategorías por categoría con soporte para subcategorías de nivel 2
 * Estructura:
 * - id: identificador único
 * - name: nombre mostrado
 * - slug: slug para URLs
 * - items?: array de subcategorías de nivel 2 (opcional)
 */
export const SUBCATEGORIES: Record<
  Category,
  {
    id: string;
    name: string;
    slug: string;
    items?: { id: string; name: string; slug: string }[];
  }[]
> = {
  clinico: [
    {
      id: "digitalizacion-por-imagenes",
      name: "Digitalización por Imágenes",
      slug: "digitalizacion-por-imagenes",
      items: [
        {
          id: "digitalizacion-directa",
          name: "Digitalización Directa",
          slug: "digitalizacion-directa",
        },
        {
          id: "digitalizacion-indirecta",
          name: "Digitalización Indirecta",
          slug: "digitalizacion-indirecta",
        },
      ],
    },
    {
      id: "subcategoria-2",
      name: "Subcategoría 2",
      slug: "subcategoria-2",
    },
  ],
  veterinario: [
    { id: "subcategoria-1", name: "Subcategoría 1", slug: "subcategoria-1" },
    { id: "subcategoria-2", name: "Subcategoría 2", slug: "subcategoria-2" },
  ],
};

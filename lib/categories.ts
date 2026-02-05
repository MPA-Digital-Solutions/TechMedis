/**
 * Configuración centralizada de categorías y subcategorías
 * Este archivo contiene toda la estructura de categorías con soporte para niveles múltiples
 */

export const CATEGORIES = ["radiologia", "mamografia", "impresoras-peliculas", "sistemas-pac-ris"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  radiologia: "Radiología",
  mamografia: "Mamografía",
  "impresoras-peliculas": "Impresoras de Películas",
  "sistemas-pac-ris": "Sistemas PAC RIS",
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
  radiologia: [
    {
      id: "equipos-de-rayos-x",
      name: "Equipos de Rayos X",
      slug: "equipos-de-rayos-x",
    },
    {
      id: "digitalizadores-directos",
      name: "Digitalizadores Directos",
      slug: "digitalizadores-directos",
    },
    {
      id: "digitalizadores-indirectos",
      name: "Digitalizadores Indirectos",
      slug: "digitalizadores-indirectos",
    },
  ],
  mamografia: [
    {
      id: "mamografos",
      name: "Mamografos",
      slug: "mamografos",
    },
    {
      id: "digitalizadores",
      name: "Digitalizadores",
      slug: "digitalizadores",
    },
  ],
  "impresoras-peliculas": [
    // Agregar subcategorías aquí
  ],
  "sistemas-pac-ris": [
    // Agregar subcategorías aquí
  ],
};

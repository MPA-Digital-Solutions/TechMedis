/**
 * Configuración centralizada de categorías y subcategorías
 * 
 * Estructura de 3 niveles:
 *   MainCategory (Productos / Veterinaria) -> Category -> Subcategory
 * 
 * En la DB, "category" almacena el slug de la Category (ej: "radiologia", "mamografia", etc.)
 * y "subcategory" almacena el slug de la Subcategory (ej: "equipos-de-rayos-x", etc.)
 */

// ==================== MAIN CATEGORIES (nivel superior del navbar) ====================

export const MAIN_CATEGORIES = ["productos", "veterinaria"] as const;
export type MainCategory = (typeof MAIN_CATEGORIES)[number];

export const MAIN_CATEGORY_LABELS: Record<MainCategory, string> = {
  productos: "Productos",
  veterinaria: "Veterinaria",
};

// Rutas base para cada main category
export const MAIN_CATEGORY_PATHS: Record<MainCategory, string> = {
  productos: "/productos",
  veterinaria: "/veterinaria",
};

// ==================== CATEGORIES (segundo nivel, aparecen en el dropdown) ====================

// Todas las categories posibles (se guardan en la DB en el campo "category")
export const CATEGORIES = [
  // Productos
  "radiologia",
  "mamografia",
  "impresoras-peliculas",
  "sistemas-pac-ris",
  // Veterinaria
  "digitalizacion-directa-veterinaria",
  "digitalizacion-indirecta-veterinaria",
  "equipos-rx-portatiles",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  // Productos
  radiologia: "Radiología",
  mamografia: "Mamografía",
  "impresoras-peliculas": "Impresoras de Películas",
  "sistemas-pac-ris": "Sistemas PAC RIS",
  // Veterinaria
  "digitalizacion-directa-veterinaria": "Digitalización Directa Veterinaria",
  "digitalizacion-indirecta-veterinaria": "Digitalización Indirecta Veterinaria",
  "equipos-rx-portatiles": "Equipos de RX Portátiles",
};

// ==================== MAPEO: qué categories pertenecen a cada main category ====================

export const CATEGORIES_BY_MAIN: Record<MainCategory, Category[]> = {
  productos: ["radiologia", "mamografia", "impresoras-peliculas", "sistemas-pac-ris"],
  veterinaria: ["digitalizacion-directa-veterinaria", "digitalizacion-indirecta-veterinaria", "equipos-rx-portatiles"],
};

// Utilidad: dado un category slug, devolver a qué main category pertenece
export function getMainCategoryFor(category: Category): MainCategory {
  for (const [main, cats] of Object.entries(CATEGORIES_BY_MAIN)) {
    if ((cats as Category[]).includes(category)) {
      return main as MainCategory;
    }
  }
  return "productos"; // fallback
}

// ==================== SUBCATEGORIES (tercer nivel, filtros dentro de cada category page) ====================

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
  // === Productos ===
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
  // === Veterinaria (sin subcategorías) ===
  "digitalizacion-directa-veterinaria": [],
  "digitalizacion-indirecta-veterinaria": [],
  "equipos-rx-portatiles": [],
};

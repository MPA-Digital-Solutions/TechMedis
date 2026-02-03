"use server";

import { prisma } from "@/lib/prisma";
import { SUBCATEGORIES } from "@/lib/validations/product";
import type { Category } from "@/lib/validations/product";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Obtiene todas las subcategorías
 */
export async function getAllSubcategories(): Promise<ActionResponse<any[]>> {
  try {
    const subcategories = await prisma.subcategory.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return { success: true, data: subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { success: false, error: "Error al obtener subcategorías" };
  }
}

/**
 * Obtiene subcategorías por categoría
 */
export async function getSubcategoriesByCategory(category: Category): Promise<ActionResponse<any[]>> {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { category },
      orderBy: { name: "asc" },
    });
    return { success: true, data: subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { success: false, error: "Error al obtener subcategorías" };
  }
}

/**
 * Inicializa las subcategorías predefinidas en la base de datos
 */
export async function initializeSubcategories(): Promise<ActionResponse> {
  try {
    // Para cada categoría, crear sus subcategorías si no existen
    for (const category of Object.keys(SUBCATEGORIES) as Category[]) {
      const subs = SUBCATEGORIES[category];
      
      for (const sub of subs) {
        await prisma.subcategory.upsert({
          where: {
            category_slug: {
              category,
              slug: sub.slug,
            },
          },
          update: {
            name: sub.name,
          },
          create: {
            name: sub.name,
            slug: sub.slug,
            category,
          },
        });
      }
    }

    return { success: true, data: { message: "Subcategorías inicializadas" } };
  } catch (error) {
    console.error("Error initializing subcategories:", error);
    return { success: false, error: "Error al inicializar subcategorías" };
  }
}

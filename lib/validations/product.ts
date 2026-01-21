import { z } from "zod";

export const CATEGORIES = ["clinico", "veterinario"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  clinico: "Clínico",
  veterinario: "Veterinario",
};

export const STATUS_OPTIONS = ["active", "inactive", "out_of_stock"] as const;
export type ProductStatus = (typeof STATUS_OPTIONS)[number];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  out_of_stock: "Sin Stock",
};

export const createProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  costPrice: z.coerce.number().min(0, "El costo debe ser mayor o igual a 0"),
  stock: z.coerce.number().int().min(0, "El stock debe ser mayor o igual a 0"),
  status: z.enum(STATUS_OPTIONS),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Categoría inválida" }),
  }),
  image: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional().default({}),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, "El ID es requerido"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  status: string;
  category: string;
  image: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-") 
    .trim();
}

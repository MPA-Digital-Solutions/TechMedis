"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type Category,
} from "@/lib/validations/product";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface PrismaProductRaw {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  category: string;
  image: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
}

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ==================== CREATE ====================
export async function createProduct(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      price: formData.get("price"),
      costPrice: formData.get("costPrice"),
      stock: formData.get("stock"),
      status: formData.get("status") as string,
      category: formData.get("category") as string,
      image: null as string | null,
    };
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const imagePath = await saveImage(imageFile);
      rawData.image = imagePath;
    }
    const validated = createProductSchema.parse(rawData);

    const existing = await prisma.product.findUnique({
      where: { slug: validated.slug },
    });
    if (existing) {
      return { success: false, error: "Ya existe un producto con este slug" };
    }

// Crear producto
    const product = await prisma.product.create({
      data: {
        ...validated,
        metadata: (validated.metadata || {}) as object,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/equipamientos-clinicos");
    revalidatePath("/equipamiento-veterinario");

    return { success: true, data: { id: product.id } };
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear el producto" };
  }
}

// ==================== UPDATE ====================
export async function updateProduct(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    const id = formData.get("id") as string;
    
    const rawData: UpdateProductInput = {
      id,
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "active" | "inactive",
      category: formData.get("category") as "clinico" | "veterinario",
    };

    const imageFile = formData.get("image") as File | null;
    const keepCurrentImage = formData.get("keepCurrentImage") === "true";
    
    // Una sola query para obtener la imagen actual (si es necesario)
    const needsImageCheck = (imageFile && imageFile.size > 0) || !keepCurrentImage;
    let currentImage: string | null = null;
    
    if (needsImageCheck) {
      const currentProduct = await prisma.product.findUnique({
        where: { id },
        select: { image: true },
      });
      currentImage = currentProduct?.image || null;
    }
    
    if (imageFile && imageFile.size > 0) {
      if (currentImage) {
        await deleteImage(currentImage);
      }
      rawData.image = await saveImage(imageFile);
    } else if (!keepCurrentImage) {
      if (currentImage) {
        await deleteImage(currentImage);
      }
      rawData.image = null;
    }

    const validated = updateProductSchema.parse(rawData);

    if (validated.slug) {
      const existing = await prisma.product.findFirst({
        where: {
          slug: validated.slug,
          NOT: { id: validated.id },
        },
      });
      if (existing) {
        return { success: false, error: "Ya existe un producto con este slug" };
      }
    }

const { id: productId, metadata, ...restUpdateData } = validated;
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...restUpdateData,
        ...(metadata !== undefined && { metadata: metadata as Prisma.InputJsonValue }),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/equipamientos-clinicos");
    revalidatePath("/equipamiento-veterinario");
    revalidatePath(`/productos/${validated.slug}`);

    return { success: true, data: { id: productId } };
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al actualizar el producto" };
  }
}

// ==================== DELETE ====================
export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { image: true },
    });

    if (product?.image) {
      await deleteImage(product.image);
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/equipamientos-clinicos");
    revalidatePath("/equipamiento-veterinario");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Error al eliminar el producto" };
  }
}

// ==================== READ ====================
export async function getProducts(options?: {
  category?: Category;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: Record<string, unknown> = {};

    if (options?.category) {
      where.category = options.category;
    }
    if (options?.status) {
      where.status = options.status;
    }
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search } },
        { description: { contains: options.search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      // Paginación: limit por defecto 50, offset por defecto 0
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });

    return products.map((p: PrismaProductRaw) => ({
      ...p,
      metadata: p.metadata as Record<string, unknown>,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// ==================== GET RELATED PRODUCTS (OPTIMIZADO) ====================
// Query directa para productos relacionados, evita N+1
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit: number = 4
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        status: "active",
        NOT: { id: excludeId },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        category: true,
        description: true,
        status: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) return null;

    return {
      ...product,
      metadata: product.metadata as Record<string, unknown>,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return {
      ...product,
      metadata: product.metadata as Record<string, unknown>,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// ==================== IMAGE HELPERS ====================
async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = file.name.split(".").pop();
  const filename = `${uniqueSuffix}.${ext}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

async function deleteImage(imagePath: string): Promise<void> {
  try {
    const fullPath = join(process.cwd(), "public", imagePath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

// ==================== TOGGLE STATUS ====================
export async function toggleProductStatus(
  id: string,
  newStatus: string
): Promise<ActionResponse> {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/equipamientos-clinicos");
    revalidatePath("/equipamiento-veterinario");

    return { success: true };
  } catch (error) {
    console.error("Error toggling status:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  createProductSchema,
  updateProductSchema,
  getMainCategoryFor,
  type CreateProductInput,
  type UpdateProductInput,
  type Category,
} from "@/lib/validations/product";
import { writeFile, mkdir, unlink, readdir, rename } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

/**
 * Revalida todas las rutas que pueden mostrar información de este producto
 */
function revalidateProductPaths(slug: string, category: string) {
  revalidatePath("/admin");
  revalidatePath("/productos");
  revalidatePath("/veterinaria");

  // Revalidar la categoría específica
  const mainCategory = getMainCategoryFor(category as Category);
  if (mainCategory === "productos") {
    revalidatePath(`/productos/${category}`);
  } else {
    revalidatePath(`/veterinaria/${category}`);
  }

  // Revalidar el detalle del producto
  revalidatePath(`/productos/${slug}`);

  // Rutas legacy (opcional, si aún existen)
  revalidatePath("/equipamientos-medicos");
  revalidatePath("/equipamiento-veterinario");
}

interface PrismaProductRaw {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  category: string;
  subcategory?: string | null;
  subcategory2?: string | null;
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

// Products upload directory
const PRODUCTS_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "products");

// ==================== CREATE ====================
export async function createProduct(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    const subcategorySlug = formData.get("subcategory") as string;
    const subcategory2Slug = formData.get("subcategory2") as string;
    const slug = formData.get("slug") as string;

    const rawData = {
      name: formData.get("name") as string,
      slug,
      description: formData.get("description") as string,
      price: formData.get("price"),
      costPrice: formData.get("costPrice"),
      stock: formData.get("stock"),
      status: formData.get("status") as string,
      category: formData.get("category") as string,
      subcategory: subcategorySlug && subcategorySlug.trim() !== "" ? subcategorySlug : null,
      subcategory2: subcategory2Slug && subcategory2Slug.trim() !== "" ? subcategory2Slug : null,
      image: null as string | null,
    };

    // Check for existing product with same slug first
    const existing = await prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      return { success: false, error: "Ya existe un producto con este slug" };
    }

    // Process main image
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      rawData.image = await saveProductImage(imageFile, slug);
    }

    // Process carousel images
    const carouselFiles = formData.getAll("carouselImages") as File[];
    const validCarouselFiles = carouselFiles.filter(f => f.size > 0);
    if (validCarouselFiles.length > 0) {
      await saveCarouselImages(validCarouselFiles, slug, 1);
    }

    const validated = createProductSchema.parse(rawData);

    // Crear producto
    const product = await prisma.product.create({
      data: {
        ...validated,
        metadata: (validated.metadata || {}) as object,
      },
    });

    // Revalidar páginas que muestran productos
    revalidateProductPaths(product.slug, product.category);

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
    const subcategorySlug = formData.get("subcategory") as string;
    const subcategory2Slug = formData.get("subcategory2") as string;
    const newSlug = formData.get("slug") as string;

    // Get current product data
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { slug: true, image: true },
    });

    if (!currentProduct) {
      return { success: false, error: "Producto no encontrado" };
    }

    const oldSlug = currentProduct.slug;
    const slugChanged = oldSlug !== newSlug;

    const rawData: UpdateProductInput = {
      id,
      name: formData.get("name") as string,
      slug: newSlug,
      description: formData.get("description") as string,
      status: formData.get("status") as "active" | "inactive",
      category: formData.get("category") as Category,
      subcategory: subcategorySlug && subcategorySlug.trim() !== "" ? subcategorySlug : null,
      subcategory2: subcategory2Slug && subcategory2Slug.trim() !== "" ? subcategory2Slug : null,
    };

    // Check for slug conflicts
    if (slugChanged) {
      const existing = await prisma.product.findFirst({
        where: {
          slug: newSlug,
          NOT: { id },
        },
      });
      if (existing) {
        return { success: false, error: "Ya existe un producto con este slug" };
      }
    }

    // Handle main image
    const imageFile = formData.get("image") as File | null;
    const keepCurrentImage = formData.get("keepCurrentImage") === "true";

    if (imageFile && imageFile.size > 0) {
      // New image uploaded - delete old one (using old slug) and save new one
      if (currentProduct.image) {
        await deleteImage(currentProduct.image);
      }
      rawData.image = await saveProductImage(imageFile, newSlug);
    } else if (!keepCurrentImage) {
      // User removed image
      if (currentProduct.image) {
        await deleteImage(currentProduct.image);
      }
      rawData.image = null;
    } else if (slugChanged && currentProduct.image) {
      // Slug changed but keeping image - need to rename image file
      const oldImagePath = join(PRODUCTS_UPLOAD_DIR, `${oldSlug}.webp`);
      const newImagePath = join(PRODUCTS_UPLOAD_DIR, `${newSlug}.webp`);
      if (existsSync(oldImagePath)) {
        await rename(oldImagePath, newImagePath);
        rawData.image = `/uploads/products/${newSlug}.webp?t=${Date.now()}`;
      }
    }

    // Handle slug change for carousel images
    if (slugChanged) {
      const carouselImages = await getCarouselImages(oldSlug);
      for (let i = 0; i < carouselImages.length; i++) {
        const oldPath = join(PRODUCTS_UPLOAD_DIR, `${oldSlug}-${i + 1}.webp`);
        const newPath = join(PRODUCTS_UPLOAD_DIR, `${newSlug}-${i + 1}.webp`);
        if (existsSync(oldPath)) {
          await rename(oldPath, newPath);
        }
      }
    }

    // Handle new carousel images
    const carouselFiles = formData.getAll("carouselImages") as File[];
    const validCarouselFiles = carouselFiles.filter(f => f.size > 0);
    if (validCarouselFiles.length > 0) {
      // Get existing carousel count to start numbering after
      const existingCarousel = await getCarouselImages(newSlug);
      const startIndex = existingCarousel.length + 1;
      await saveCarouselImages(validCarouselFiles, newSlug, startIndex);
    }

    // Handle carousel reordering
    const carouselOrder = formData.get("carouselOrder") as string;
    if (carouselOrder) {
      const orderArray = JSON.parse(carouselOrder) as number[];
      if (orderArray.length > 0) {
        await reorderCarouselImages(newSlug, orderArray);
      }
    }

    const validated = updateProductSchema.parse(rawData);

    const { id: productId, metadata, ...restUpdateData } = validated;
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...restUpdateData,
        ...(metadata !== undefined && { metadata: metadata as Prisma.InputJsonValue }),
      },
    });

    // Revalidar páginas que muestran productos
    revalidateProductPaths(validated.slug, validated.category);
    if (slugChanged) {
      revalidatePath(`/productos/${oldSlug}`);
    }

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
      select: { slug: true, image: true },
    });

    if (product) {
      // Delete all product images (main + carousel)
      await deleteAllProductImages(product.slug);

      // Also delete legacy image if it exists (for backward compatibility)
      if (product.image && !product.image.includes(`/products/${product.slug}`)) {
        await deleteImage(product.image);
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    // Revalidar páginas que muestran productos
    revalidatePath("/admin");
    revalidatePath("/productos");
    revalidatePath("/veterinaria");
    revalidatePath("/equipamientos-medicos");
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

async function ensureUploadDir(): Promise<void> {
  if (!existsSync(PRODUCTS_UPLOAD_DIR)) {
    await mkdir(PRODUCTS_UPLOAD_DIR, { recursive: true });
  }
}

async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer();
}

// Save main product image as {slug}.webp
async function saveProductImage(file: File, slug: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const webpBuffer = await convertToWebp(buffer);

  await ensureUploadDir();

  const filename = `${slug}.webp`;
  const filepath = join(PRODUCTS_UPLOAD_DIR, filename);

  await writeFile(filepath, webpBuffer);

  return `/uploads/products/${filename}?t=${Date.now()}`;
}

// Save carousel images as {slug}-1.webp, {slug}-2.webp, etc.
async function saveCarouselImages(files: File[], slug: string, startIndex: number = 1): Promise<string[]> {
  await ensureUploadDir();

  const savedPaths: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const webpBuffer = await convertToWebp(buffer);

    const index = startIndex + i;
    const filename = `${slug}-${index}.webp`;
    const filepath = join(PRODUCTS_UPLOAD_DIR, filename);

    await writeFile(filepath, webpBuffer);
    savedPaths.push(`/uploads/products/${filename}`);
  }

  return savedPaths;
}

// Get all carousel images for a product (returns sorted paths)
export async function getCarouselImages(slug: string): Promise<string[]> {
  try {
    await ensureUploadDir();

    const files = await readdir(PRODUCTS_UPLOAD_DIR);
    const carouselPattern = new RegExp(`^${slug}-(\\d+)\\.webp$`);

    const carouselFiles = files
      .filter(file => carouselPattern.test(file))
      .map(file => {
        const match = file.match(carouselPattern);
        return {
          file,
          index: match ? parseInt(match[1], 10) : 0
        };
      })
      .sort((a, b) => a.index - b.index)
      .map(item => `/uploads/products/${item.file}`);

    return carouselFiles;
  } catch (error) {
    console.error("Error getting carousel images:", error);
    return [];
  }
}

// Reorder carousel images based on new order array
export async function reorderCarouselImages(
  slug: string,
  newOrder: number[] // Array of current indices in new order, e.g., [3, 1, 2] means image 3 becomes 1, image 1 becomes 2, etc.
): Promise<ActionResponse> {
  try {
    await ensureUploadDir();

    // First, rename all to temporary names to avoid conflicts
    const tempPrefix = `_temp_${Date.now()}_`;

    for (const currentIndex of newOrder) {
      const oldPath = join(PRODUCTS_UPLOAD_DIR, `${slug}-${currentIndex}.webp`);
      const tempPath = join(PRODUCTS_UPLOAD_DIR, `${tempPrefix}${currentIndex}.webp`);

      if (existsSync(oldPath)) {
        await rename(oldPath, tempPath);
      }
    }

    // Then rename from temp to new indices
    for (let newIndex = 0; newIndex < newOrder.length; newIndex++) {
      const currentIndex = newOrder[newIndex];
      const tempPath = join(PRODUCTS_UPLOAD_DIR, `${tempPrefix}${currentIndex}.webp`);
      const newPath = join(PRODUCTS_UPLOAD_DIR, `${slug}-${newIndex + 1}.webp`);

      if (existsSync(tempPath)) {
        await rename(tempPath, newPath);
      }
    }

    // Revalidar para que se vean los cambios en el frontend
    revalidatePath(`/productos/${slug}`);

    return { success: true };
  } catch (error) {
    console.error("Error reordering carousel images:", error);
    return { success: false, error: "Error al reordenar imágenes" };
  }
}

// Delete a single carousel image and reorder remaining
export async function deleteCarouselImage(
  slug: string,
  imageIndex: number
): Promise<ActionResponse> {
  try {
    const imagePath = join(PRODUCTS_UPLOAD_DIR, `${slug}-${imageIndex}.webp`);

    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }

    // Get remaining images and reorder
    const remainingImages = await getCarouselImages(slug);
    if (remainingImages.length > 0) {
      // Extract current indices
      const currentIndices = remainingImages.map(path => {
        const match = path.match(/-(\d+)\.webp$/);
        return match ? parseInt(match[1], 10) : 0;
      });

      // Reorder to fill the gap
      await reorderCarouselImages(slug, currentIndices);
    }

    // Revalidar
    revalidatePath(`/productos/${slug}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    return { success: false, error: "Error al eliminar imagen" };
  }
}

// Delete main product image
async function deleteProductImage(slug: string): Promise<void> {
  try {
    const fullPath = join(PRODUCTS_UPLOAD_DIR, `${slug}.webp`);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error("Error deleting product image:", error);
  }
}

// Delete all carousel images for a product
async function deleteAllCarouselImages(slug: string): Promise<void> {
  try {
    const carouselImages = await getCarouselImages(slug);
    for (const imagePath of carouselImages) {
      const fullPath = join(process.cwd(), "public", imagePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }
    }
  } catch (error) {
    console.error("Error deleting carousel images:", error);
  }
}

// Delete all images for a product (main + carousel) - for product deletion
async function deleteAllProductImages(slug: string): Promise<void> {
  await deleteProductImage(slug);
  await deleteAllCarouselImages(slug);
}

// Legacy: Delete image by path (for backward compatibility during migration)
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

    // Revalidar páginas que muestran productos
    revalidateProductPaths(product.slug, product.category);

    return { success: true };
  } catch (error) {
    console.error("Error toggling status:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }
}

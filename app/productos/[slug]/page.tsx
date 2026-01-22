import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/actions/products";
import { getWhatsAppNumber } from "@/lib/actions/config";
import { ProductDetailClient } from "./client";
import type { Product } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado - Techmedis",
    };
  }

  return {
    title: `${product.name} - Techmedis`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: Product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, whatsappNumber] = await Promise.all([
    getProductBySlug(slug),
    getWhatsAppNumber(),
  ]);

  if (!product) {
    notFound();
  }

  // Obtener productos relacionados de la misma categoría
  const relatedProducts = await getProducts({ 
    category: product.category as "clinico" | "veterinario", 
    status: "active" 
  });
  
  // Filtrar el producto actual y limitar a 4
  const filteredRelated = relatedProducts
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={filteredRelated} 
      whatsappNumber={whatsappNumber}
    />
  );
}

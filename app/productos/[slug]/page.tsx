import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/actions/products";
import { getWhatsAppNumber } from "@/lib/actions/config";
import { ProductDetailClient } from "./client";
import type { Product } from "@/lib/validations/product";

// ISR: Regenerar página cada 10 minutos (600 segundos) para cambios rápidos
export const revalidate = 600;

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

  // Obtener productos relacionados usando query OPTIMIZADA (solo 4 items, select específico)
  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
    4
  );

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
      whatsappNumber={whatsappNumber}
    />
  );
}

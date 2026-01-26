"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Package } from "lucide-react";

// Tipo mínimo necesario para mostrar ProductCard
interface ProductGridItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  status: string;
}

interface ProductsGridProps {
  products: ProductGridItem[];
  emptyMessage?: string;
  whatsappNumber?: string;
}

export function ProductsGrid({ products, emptyMessage = "No hay productos disponibles.", whatsappNumber }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-techmedis-primary/10 mb-8">
          <Package className="w-12 h-12 text-techmedis-primary" />
        </div>
        <h3 className="text-2xl font-bold text-techmedis-primary mb-3">Sin Productos</h3>
        <p className="text-techmedis-text text-lg max-w-md mx-auto">{emptyMessage}</p>
      </motion.div>
    );
  }

  // Layout: Un producto por fila, centrado, máximo ancho
  return (
    <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
          className="w-full"
        >
          <ProductCard product={product} whatsappNumber={whatsappNumber} />
        </motion.div>
      ))}
    </div>
  );
}

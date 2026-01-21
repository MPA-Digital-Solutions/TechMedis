"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/validations/product";

interface ProductsGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductsGrid({ products, emptyMessage = "No hay productos disponibles." }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-techmedis-primary/10 mb-6">
          <svg className="w-10 h-10 text-techmedis-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-techmedis-primary mb-2">Sin Productos</h3>
        <p className="text-techmedis-text max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}

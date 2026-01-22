"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Package } from "lucide-react";
import type { Product } from "@/lib/validations/product";

interface ProductsGridProps {
  products: Product[];
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

  // Dynamic grid: max 2 per row, centered
  const isSingleProduct = products.length === 1;
  const isOddCount = products.length % 2 !== 0;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Main grid: 2 columns max */}
      <div className={`grid gap-8 w-full ${
        isSingleProduct 
          ? 'grid-cols-1 max-w-xl mx-auto' 
          : 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
      }`}>
        {products.map((product, index) => {
          // If odd count, skip last item here (we'll render it centered below)
          if (isOddCount && !isSingleProduct && index === products.length - 1) {
            return null;
          }
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <ProductCard product={product} whatsappNumber={whatsappNumber} />
            </motion.div>
          );
        })}
      </div>
      
      {/* Last item centered if odd count (and more than 1 product) */}
      {isOddCount && !isSingleProduct && (
        <div className="w-full max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (products.length - 1) * 0.1, ease: "easeOut" }}
          >
            <ProductCard product={products[products.length - 1]} whatsappNumber={whatsappNumber} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

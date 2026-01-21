"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/validations/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;
  const isInactive = product.status === "inactive";

  return (
    <motion.div
      whileHover="hover"
      className="bg-white border border-gray-100 rounded-xl overflow-hidden group flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-techmedis-light overflow-hidden">
          {product.image ? (
            <motion.div
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-techmedis-light to-gray-100">
              <svg className="w-16 h-16 text-techmedis-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Sin Stock
              </span>
            )}
            {isInactive && (
              <span className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                No Disponible
              </span>
            )}
          </div>

          {/* Categoría */}
          <div className="absolute bottom-3 right-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-full shadow-md ${
              product.category === "clinico" 
                ? "bg-blue-500 text-white" 
                : "bg-green-500 text-white"
            }`}>
              {product.category === "clinico" ? "Clínico" : "Veterinario"}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-techmedis-primary mb-2 line-clamp-2 group-hover:text-techmedis-secondary transition-colors">
            {product.name}
          </h3>
          <p className="text-techmedis-text text-sm mb-4 line-clamp-2 flex-grow font-light">
            {product.description}
          </p>
          
          {/* Precio y CTA */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-techmedis-primary">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-amber-600 font-medium">
                  ¡Solo {product.stock}!
                </span>
              )}
            </div>
            
            <motion.div
              variants={{ hover: { scale: 1.02 } }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <span className="block w-full text-center bg-techmedis-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-techmedis-primary/90 transition-colors">
                Ver Detalles
              </span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

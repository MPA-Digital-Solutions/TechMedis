"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Package, Tag, Check, AlertTriangle } from "lucide-react";
import type { Product } from "@/lib/validations/product";

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export function ProductCard({ product, whatsappNumber = "5491112345678" }: ProductCardProps) {
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
  const isAvailable = !isOutOfStock && !isInactive;

  const whatsappMessage = encodeURIComponent(
    `Hola! Estoy interesado en el producto: ${product.name}. Me gustaría recibir más información.`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
    >
      {/* Image Section */}
      <Link href={`/productos/${product.slug}`} className="block relative">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-techmedis-light to-gray-100 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-20 h-20 text-techmedis-primary/20" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              product.category === "clinico" 
                ? "bg-blue-500/90 text-white" 
                : "bg-emerald-500/90 text-white"
            }`}>
              <Tag className="w-3 h-3" />
              {product.category === "clinico" ? "Clínico" : "Veterinario"}
            </span>
          </div>

          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {isOutOfStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                <AlertTriangle className="w-3 h-3" />
                Sin Stock
              </span>
            )}
            {isInactive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/90 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                No Disponible
              </span>
            )}
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                <Check className="w-3 h-3" />
                Disponible
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        {/* Title */}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-xl font-bold text-techmedis-primary mb-3 line-clamp-2 group-hover:text-techmedis-secondary transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-techmedis-text text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="border-t border-gray-100 pt-5 mt-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="block text-xs text-techmedis-text/60 uppercase tracking-wide font-medium mb-1">
                Precio
              </span>
              <span className="text-3xl font-bold text-techmedis-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  Quedan {product.stock}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link 
              href={`/productos/${product.slug}`}
              className="flex-1 text-center py-3 px-4 bg-techmedis-light text-techmedis-primary font-semibold rounded-xl hover:bg-techmedis-primary hover:text-white transition-all duration-300"
            >
              Ver Detalles
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

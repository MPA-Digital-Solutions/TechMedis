"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Package, Tag, Check, ArrowRight } from "lucide-react";

// Tipo mínimo necesario para mostrar un ProductCard
interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  status: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  whatsappNumber?: string;
}

export function ProductCard({ product, whatsappNumber = "5491112345678" }: ProductCardProps) {
  const isInactive = product.status === "inactive";
  const isAvailable = !isInactive;

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
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section - Más grande */}
        <Link href={`/productos/${product.slug}`} className="block relative lg:w-2/5">
          <div className="relative aspect-[4/3] lg:aspect-square bg-gradient-to-br from-techmedis-light to-gray-100 overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-techmedis-primary/20" />
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                product.category === "clinico" 
                  ? "bg-blue-500/90 text-white" 
                  : "bg-emerald-500/90 text-white"
              }`}>
                <Tag className="w-3.5 h-3.5" />
                {product.category === "clinico" ? "Clínico" : "Veterinario"}
              </span>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/90 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                  <Check className="w-3.5 h-3.5" />
                  Disponible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-500/90 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                  No Disponible
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Content Section - Más espacioso */}
        <div className="flex flex-col flex-grow p-8 lg:w-3/5">
          {/* Title */}
          <Link href={`/productos/${product.slug}`}>
            <h3 className="text-2xl lg:text-3xl font-bold text-techmedis-primary mb-4 group-hover:text-techmedis-secondary transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-techmedis-text text-base leading-relaxed mb-8 flex-grow line-clamp-4 lg:line-clamp-5">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Link 
              href={`/productos/${product.slug}`}
              className="group/btn relative flex-1 text-center py-4 px-6 bg-techmedis-primary text-white font-semibold rounded-xl overflow-hidden transition-all duration-500"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-gradient-to-r from-techmedis-secondary to-techmedis-primary transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                Ver Detalles
                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

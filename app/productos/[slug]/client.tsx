"use client";

import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/optimized-image";
import Link from "next/link";
import { ArrowLeft, Package, Tag, CheckCircle, XCircle, Phone, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/validations/product";

// Tipo ligero para productos relacionados (solo campos necesarios para mostrar cards)
interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image: string | null;
  status: string;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  whatsappNumber?: string;
}

export function ProductDetailClient({ product, relatedProducts, whatsappNumber = "5491112345678" }: ProductDetailClientProps) {
  const isActive = product.status === "active";
  const categoryLabel = product.category === "clinico" ? "Clínico" : "Veterinario";
  const categoryColor = product.category === "clinico" ? "blue" : "green";

  const whatsappMessage = encodeURIComponent(
    `Hola! Estoy interesado en el producto: ${product.name}. ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-techmedis-light py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-techmedis-text hover:text-techmedis-primary transition-colors">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={product.category === "clinico" ? "/equipamientos-clinicos" : "/equipamiento-veterinario"} 
              className="text-techmedis-text hover:text-techmedis-primary transition-colors"
            >
              {product.category === "clinico" ? "Equipamientos Clínicos" : "Equipamiento Veterinario"}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-techmedis-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Detalle del Producto */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href={product.category === "clinico" ? "/equipamientos-clinicos" : "/equipamiento-veterinario"}
            className="inline-flex items-center text-techmedis-primary hover:text-techmedis-secondary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
               <div className="aspect-square rounded-2xl overflow-hidden bg-techmedis-light shadow-lg">
                 {product.image ? (
                   <OptimizedImage
                     src={product.image}
                     alt={product.name}
                     fill
                     className="object-cover"
                     priority
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-techmedis-light to-gray-100">
                     <Package className="w-32 h-32 text-techmedis-primary/20" />
                   </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                  categoryColor === "blue" 
                    ? "bg-blue-500 text-white" 
                    : "bg-green-500 text-white"
                }`}>
                  <Tag className="w-4 h-4 mr-2" />
                  {categoryLabel}
                </span>
              </div>
            </motion.div>

            {/* Información */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-techmedis-primary mb-4">
                {product.name}
              </h1>

              {/* Estado */}
              <div className="flex items-center gap-4 mb-6">
                {isActive ? (
                  <span className="inline-flex items-center text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-full">
                    <XCircle className="w-5 h-5 mr-2" />
                    No Disponible
                  </span>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-8 flex-grow">
                <h2 className="text-lg font-semibold text-techmedis-primary mb-3">Descripción</h2>
                <p className="text-techmedis-text leading-relaxed whitespace-pre-line text-lg">
                  {product.description}
                </p>
              </div>

              {/* Call to Action Box */}
              <div className="bg-gradient-to-br from-techmedis-light to-blue-50 rounded-2xl p-6 mb-8">
                <p className="text-techmedis-primary font-semibold text-lg mb-2">
                  ¿Interesado en este equipo?
                </p>
                <p className="text-techmedis-text text-sm">
                  Contáctenos para recibir información detallada, cotización y asesoría personalizada.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a
                  href="tel:+543585050000"
                  className="flex-1 inline-flex items-center justify-center bg-techmedis-primary hover:bg-techmedis-secondary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar Ahora
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-techmedis-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-techmedis-primary mb-8 text-center">
                Productos Relacionados
              </h2>
              
              <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
                {relatedProducts.slice(0, 2).map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <ProductCard product={relatedProduct} whatsappNumber={whatsappNumber} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-techmedis-primary to-techmedis-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Necesitas más información?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Nuestro equipo de expertos está listo para asesorarte y ayudarte a encontrar 
              el equipamiento ideal para tu clínica.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center bg-white text-techmedis-primary font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Contactar un Asesor
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

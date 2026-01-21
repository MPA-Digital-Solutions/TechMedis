"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Tag, CheckCircle, XCircle, Phone, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/validations/product";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isInStock = product.stock > 0;
  const isActive = product.status === "active";
  const categoryLabel = product.category === "clinico" ? "Clínico" : "Veterinario";
  const categoryColor = product.category === "clinico" ? "blue" : "green";

  const whatsappMessage = encodeURIComponent(
    `Hola! Estoy interesado en el producto: ${product.name}. ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/5493585050000?text=${whatsappMessage}`;

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
                  <Image
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

              {/* Estado de Stock */}
              <div className="flex items-center gap-4 mb-6">
                {isInStock ? (
                  <span className="inline-flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    En Stock ({product.stock} disponibles)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-amber-600 font-medium">
                    <XCircle className="w-5 h-5 mr-2" />
                    Sin Stock
                  </span>
                )}
                {!isActive && (
                  <span className="inline-flex items-center text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                    No Disponible
                  </span>
                )}
              </div>

              {/* Precio */}
              <div className="bg-techmedis-light rounded-xl p-6 mb-8">
                <p className="text-sm text-techmedis-text mb-2">Precio</p>
                <p className="text-4xl font-bold text-techmedis-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-techmedis-text mt-2">IVA incluido</p>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-techmedis-primary mb-3">Descripción</h2>
                <p className="text-techmedis-text leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Consultar por WhatsApp
                </a>
                <a
                  href="tel:+543585050000"
                  className="flex-1 inline-flex items-center justify-center bg-techmedis-primary hover:bg-techmedis-secondary text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
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
              <h2 className="text-2xl md:text-3xl font-bold text-techmedis-primary mb-8">
                Productos Relacionados
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductCard product={relatedProduct} />
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

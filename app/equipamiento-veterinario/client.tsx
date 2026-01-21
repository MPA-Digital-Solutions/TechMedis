"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/filter-bar";

const categories = ["Diagnóstico", "Quirúrgico", "Monitoreo", "Laboratorio"];

const products = [
  {
    id: 1,
    name: "Ecógrafo Veterinario Portátil",
    description: "Versatilidad para pequeños y grandes animales.",
    category: "Diagnóstico",
    image: "https://images.unsplash.com/photo-1682001370529-878ec33a474f",
  },
  {
    id: 2,
    name: "Mesa Quirúrgica Inox",
    description: "Acero inoxidable con altura regulable.",
    category: "Quirúrgico",
    image: "https://images.unsplash.com/photo-1629909615957-be38d48fbbe6",
  },
  {
    id: 3,
    name: "Monitor Veterinario",
    description: "Parámetros específicos para veterinaria.",
    category: "Monitoreo",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
  },
  {
    id: 4,
    name: "Analizador Hematológico",
    description: "Resultados rápidos en clínica.",
    category: "Laboratorio",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
  },
  {
    id: 5,
    name: "Sistema Rayos X Digital",
    description: "Alta definición para diagnóstico óseo.",
    category: "Diagnóstico",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  },
  {
    id: 6,
    name: "Máquina de Anestesia",
    description: "Vaporizador de alta precisión.",
    category: "Quirúrgico",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561",
  },
  {
    id: 7,
    name: "Bomba de Infusión Vet",
    description: "Control preciso de fluidos.",
    category: "Monitoreo",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
  {
    id: 8,
    name: "Microscopio de Laboratorio",
    description: "Óptica clara para citología.",
    category: "Laboratorio",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b",
  },
];

export default function EquipoVeterinarioClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      {/* Header */}
      <section className="bg-techmedis-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-semibold text-techmedis-primary mb-6">Equipamiento Veterinario</h1>
              <p className="text-xl text-techmedis-text font-light leading-relaxed">
                Soluciones especializadas y robustas para el cuidado y tratamiento animal, adaptadas a las necesidades de la clínica moderna.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1690306815542-3c0e7b85e996" 
                alt="Equipamiento Veterinario Hero" 
                className="w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

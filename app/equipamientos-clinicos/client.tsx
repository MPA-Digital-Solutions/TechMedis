"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/filter-bar";

const categories = ["Diagnóstico", "Monitoreo", "Quirúrgico", "Laboratorio"];

const products = [
  {
    id: 1,
    name: "Ecógrafo de Alta Resolución",
    description: "Tecnología Doppler color para diagnóstico preciso.",
    category: "Diagnóstico",
    image: "https://images.unsplash.com/photo-1657778752500-9da406aa813f",
  },
  {
    id: 2,
    name: "Monitor de Signos Vitales",
    description: "Multiparamétrico para UCI y quirófano.",
    category: "Monitoreo",
    image: "https://images.unsplash.com/photo-1663365520163-cf0ef0afb744",
  },
  {
    id: 3,
    name: "Mesa Quirúrgica Eléctrica",
    description: "Ajuste eléctrico y control remoto integrado.",
    category: "Quirúrgico",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  },
  {
    id: 4,
    name: "Analizador Bioquímico",
    description: "Alta velocidad para laboratorios clínicos.",
    category: "Laboratorio",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  },
  {
    id: 5,
    name: "Electrocardiógrafo Digital",
    description: "12 canales con interpretación automática.",
    category: "Diagnóstico",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 6,
    name: "Desfibrilador Bifásico",
    description: "Modo DEA y manual con monitor.",
    category: "Quirúrgico",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  },
  {
    id: 7,
    name: "Bomba de Infusión",
    description: "Volumétrica de alta precisión.",
    category: "Monitoreo",
    image: "https://images.unsplash.com/photo-1583912267652-2c6762330f65",
  },
  {
    id: 8,
    name: "Microscopio Binocular",
    description: "Iluminación LED y óptica avanzada.",
    category: "Laboratorio",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
  },
];

export default function EquiposClinicosClient() {
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
              <h1 className="text-4xl md:text-5xl font-semibold text-techmedis-primary mb-6">Equipamientos Clínicos</h1>
              <p className="text-xl text-techmedis-text font-light leading-relaxed">
                Tecnología médica avanzada para optimizar el diagnóstico y la atención al paciente, con el respaldo de las mejores marcas internacionales.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-sm"
            >
               <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514" 
                  alt="Equipamiento Clínico Hero" 
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

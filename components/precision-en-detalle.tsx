"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/cta-button";

const images = [
  "https://images.unsplash.com/photo-1615070711870-d2e1e7ade196",
  "https://images.unsplash.com/photo-1694106722203-38363d0015d3",
  "https://images.unsplash.com/photo-1619473667957-c7e7add41ef3"
];

export function PrecisionEnDetalle() {
  return (
    <section className="py-24 bg-techmedis-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-techmedis-primary mb-4">
            Precisión en cada detalle
          </h2>
          <p className="text-lg text-techmedis-text font-normal max-w-2xl mx-auto leading-relaxed">
            Ingeniería biomédica de vanguardia diseñada para los entornos clínicos más exigentes, garantizando fiabilidad absoluta en cada diagnóstico.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.32, delay: index * 0.1, ease: "easeOut" }}
              className="aspect-[4/3] overflow-hidden rounded-sm bg-gray-50"
            >
              <img 
                src={img} 
                alt="Detalle de equipamiento médico de alta precisión" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.32, delay: 0.4, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <CTAButton variant="primary" to="/equipamientos-medicos">
            Ver equipamiento
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}

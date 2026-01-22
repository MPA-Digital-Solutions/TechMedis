"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Wrench, HeartHandshake } from "lucide-react";

const pillars = [
  {
    title: "Diagnóstico Integral",
    description: "Análisis técnico de necesidades específicas.",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
  {
    title: "Soluciones Personalizadas",
    description: "Equipamiento adaptado a cada institución.",
    icon: <Zap className="w-8 h-8" />,
  },
  {
    title: "Implementación Profesional",
    description: "Instalación y capacitación especializada.",
    icon: <Wrench className="w-8 h-8" />,
  },
  {
    title: "Soporte Continuo",
    description: "Mantenimiento y asistencia técnica permanente.",
    icon: <HeartHandshake className="w-8 h-8" />,
  },
];

export function HowWeWork() {
  return (
    <section className="py-24 bg-techmedis-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="text-center mb-16"
        >
<h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Cómo trabajamos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.32,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-white mb-6 p-4 bg-white/10 rounded-full transition-transform duration-300 group-hover:scale-105 border border-white/20">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed font-light max-w-[200px]">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

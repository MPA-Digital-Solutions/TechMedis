"use client";

import { motion } from "framer-motion";
import { Wrench, Settings, GraduationCap, Headphones, FileText, Shield, ClipboardCheck, Activity } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { CTAButton } from "@/components/cta-button";

const services = [
  {
    name: "Asesoría Técnica",
    description: "Evaluación experta para la selección del equipamiento ideal.",
    icon: <ClipboardCheck className="w-10 h-10" />,
  },
  {
    name: "Instalación",
    description: "Montaje profesional y puesta en marcha certificada.",
    icon: <Wrench className="w-10 h-10" />,
  },
  {
    name: "Mantenimiento Preventivo",
    description: "Programas periódicos para asegurar longevidad y precisión.",
    icon: <Settings className="w-10 h-10" />,
  },
  {
    name: "Capacitación",
    description: "Entrenamiento especializado para su personal operativo.",
    icon: <GraduationCap className="w-10 h-10" />,
  },
  {
    name: "Soporte Técnico 24/7",
    description: "Respuesta rápida ante cualquier eventualidad técnica.",
    icon: <Headphones className="w-10 h-10" />,
  },
  {
    name: "Consultoría de Proyectos",
    description: "Diseño integral para nuevas clínicas y ampliaciones.",
    icon: <FileText className="w-10 h-10" />,
  },
  {
    name: "Calibración",
    description: "Ajuste de precisión bajo estándares internacionales.",
    icon: <Activity className="w-10 h-10" />,
  },
  {
    name: "Garantía Extendida",
    description: "Protección adicional para su inversión a largo plazo.",
    icon: <Shield className="w-10 h-10" />,
  },
];

export default function ServiciosClient() {
  return (
    <>
      {/* Header */}
      <section className="bg-techmedis-light py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-semibold text-techmedis-primary mb-6"
            >
              Servicios Profesionales
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-techmedis-text font-light leading-relaxed"
            >
              Respaldo técnico integral diseñado para garantizar la operatividad continua y la máxima eficiencia de su institución de salud.
            </motion.p>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-50 rounded-full blur-3xl"></div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-techmedis-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-techmedis-primary mb-6">
              ¿Requiere asistencia técnica inmediata?
            </h2>
            <p className="text-lg text-techmedis-text mb-10 max-w-2xl mx-auto font-light">
              Nuestro equipo de ingenieros y técnicos está listo para brindarle la solución que necesita con la urgencia que su práctica requiere.
            </p>
            <CTAButton variant="primary" to="/contacto">
              Consultar con un asesor
            </CTAButton>
          </motion.div>
        </div>
      </section>
    </>
  );
}

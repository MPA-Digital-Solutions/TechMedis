"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Wrench, Shield, Headphones } from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import { HowWeWork } from "@/components/how-we-work";
import { PrecisionEnDetalle } from "@/components/precision-en-detalle";

const services = [
  { title: "Asesoría Técnica", icon: <ClipboardList className="w-8 h-8" />, desc: "Expertos a su disposición." },
  { title: "Instalación", icon: <Wrench className="w-8 h-8" />, desc: "Montaje certificado y seguro." },
  { title: "Mantenimiento", icon: <Shield className="w-8 h-8" />, desc: "Planes preventivos anuales." },
  { title: "Soporte 24/7", icon: <Headphones className="w-8 h-8" />, desc: "Respuesta inmediata garantizada." },
];

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-techmedis-primary overflow-hidden py-20 md:py-32">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" 
            alt="Medical Equipment Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-techmedis-primary via-techmedis-primary/80 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight"
            >
              Tecnología Médica de <br />Alta Precisión y Rendimiento
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.1, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/90 mb-10 font-normal max-w-xl leading-relaxed"
            >
              Proveemos soluciones integrales para instituciones de salud y centros veterinarios, respaldadas por soporte técnico especializado.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <CTAButton variant="primary" to="/contacto">
                Consultar con un asesor
              </CTAButton>
              <CTAButton variant="outline" to="/equipamientos-clinicos">
                Ver equipamiento
              </CTAButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PRECISIÓN EN DETALLE */}
      <PrecisionEnDetalle />

      {/* 3. CÓMO TRABAJAMOS */}
      <HowWeWork />

      {/* 4. EQUIPAMIENTO PREVIEW */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg mb-6 shadow-sm border border-gray-100 aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1565647946321-a146ac24a220" 
                  alt="Equipamiento Clínico" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-techmedis-primary mb-3">
                Equipamiento Clínico
              </h3>
              <p className="text-techmedis-text mb-6 text-lg font-light">
                Soluciones integrales para hospitales y centros de diagnóstico.
              </p>
              <Link href="/equipamientos-clinicos">
                <CTAButton variant="primary" className="opacity-90 hover:opacity-100">
                  Consultar
                </CTAButton>
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg mb-6 shadow-sm border border-gray-100 aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1691934338662-2ce7f3134f36" 
                  alt="Equipamiento Veterinario" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-techmedis-primary mb-3">
                Equipamiento Veterinario
              </h3>
              <p className="text-techmedis-text mb-6 text-lg font-light">
                Tecnología especializada para el cuidado animal avanzado.
              </p>
              <Link href="/equipamiento-veterinario">
                <CTAButton variant="primary" className="opacity-90 hover:opacity-100">
                  Consultar
                </CTAButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. SERVICIOS */}
      <section className="py-16 md:py-24 bg-techmedis-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-20 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Servicios Integrales</h2>
            <p className="text-lg text-white/80 font-light max-w-2xl">Acompañamiento profesional en cada etapa del ciclo de vida de su equipamiento.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: index * 0.1, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOBRE NOSOTROS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-techmedis-primary mb-8">Respaldo Institucional</h2>
              <div className="space-y-6 text-lg text-techmedis-text font-light leading-relaxed">
                <p>
                  Más de una década brindando soluciones tecnológicas de alta gama. Nos dedicamos a elevar los estándares de atención médica a través de equipamiento confiable.
                </p>
                <p>
                  Nuestro compromiso va más allá de la venta; construimos relaciones duraderas basadas en la confianza y el soporte técnico de excelencia.
                </p>
              </div>
              <div className="mt-10">
                 <CTAButton variant="primary" to="/sobre-nosotros">
                  Conocer más
                </CTAButton>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-8"
            >
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <span className="block text-5xl font-bold text-techmedis-secondary mb-2">15+</span>
                <span className="text-xs font-semibold text-techmedis-text uppercase tracking-widest">Años Experiencia</span>
              </div>
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <span className="block text-5xl font-bold text-techmedis-secondary mb-2">500+</span>
                <span className="text-xs font-semibold text-techmedis-text uppercase tracking-widest">Clientes</span>
              </div>
              <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                <span className="block text-5xl font-bold text-techmedis-secondary mb-2">24/7</span>
                <span className="text-xs font-semibold text-techmedis-text uppercase tracking-widest">Soporte</span>
              </div>
              <div className="bg-white p-8 rounded-lg text-center flex items-center justify-center shadow-sm">
                <span className="text-xl font-semibold text-techmedis-primary italic">&quot;Calidad Certificada&quot;</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

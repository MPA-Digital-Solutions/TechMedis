"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/cta-button";

const metrics = [
  { label: "Años de Experiencia", value: "15+" },
  { label: "Clientes Activos", value: "500+" },
  { label: "Equipos Instalados", value: "2k+" },
  { label: "Cobertura Nacional", value: "100%" },
];

export default function SobreNosotrosClient() {
  return (
    <>
      {/* Hero */}
      <section className="bg-techmedis-light py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-semibold text-techmedis-primary mb-6"
          >
            Sobre Techmedis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-techmedis-text font-light max-w-3xl mx-auto leading-relaxed"
          >
            Compromiso inquebrantable con la excelencia tecnológica en el sector salud.
          </motion.p>
        </div>
      </section>

      {/* Institutional Text */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg mx-auto text-techmedis-text font-light"
          >
            <p className="mb-8 leading-relaxed">
              En Techmedis, nos dedicamos a transformar la atención sanitaria mediante la provisión de tecnología médica de vanguardia. Desde nuestra fundación, hemos mantenido una visión clara: ser el socio tecnológico de confianza para instituciones de salud que buscan precisión, durabilidad y soporte integral.
            </p>
            <p className="mb-8 leading-relaxed">
              Nuestra filosofía se basa en la selección rigurosa de equipamiento que cumple con los más altos estándares internacionales. No solo distribuimos equipos; ofrecemos soluciones completas que incluyen asesoramiento experto, instalación certificada y un servicio post-venta que garantiza la continuidad operativa de nuestros clientes.
            </p>
            <p className="leading-relaxed">
              Entendemos que detrás de cada equipo hay un paciente esperando un diagnóstico o tratamiento. Esta responsabilidad nos impulsa a mejorar continuamente nuestros procesos y a mantenernos a la vanguardia de la innovación médica y veterinaria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-24 bg-techmedis-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-techmedis-secondary mb-3">{metric.value}</div>
                <div className="text-sm uppercase tracking-wider text-techmedis-text font-semibold">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-techmedis-primary mb-6">
              Hablemos de su próximo proyecto
            </h2>
            <p className="text-lg text-techmedis-text mb-10 font-light">
              Permítanos asesorarle en la selección del equipamiento ideal para su institución.
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

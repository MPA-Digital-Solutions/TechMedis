"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/cta-button";
import { ReactNode } from "react";

interface Service {
  name: string;
  description: string;
  icon: ReactNode;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="mb-4 text-techmedis-secondary">
        {service.icon}
      </div>
      <h3 className="text-lg font-bold text-techmedis-primary mb-2">{service.name}</h3>
      <p className="text-techmedis-text text-sm mb-6 flex-grow">{service.description}</p>
      <CTAButton variant="primary" className="w-full text-sm py-2" to="/contacto">
        Consultar con un asesor
      </CTAButton>
    </motion.div>
  );
}

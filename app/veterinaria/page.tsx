"use client";

import { motion } from "framer-motion";
import { CategoryCardsGrid, veterinariaCards } from "@/components/category-cards";

export default function VeterinariaPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-display text-white mb-6">
                        Equipamiento Veterinario
                    </h1>
                    <p className="text-xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
                        Descubra nuestra línea completa de equipamiento veterinario de las mejores marcas internacionales,
                        diseñado para optimizar el diagnóstico y la atención animal.
                    </p>
                </div>
            </section>

            {/* Categorías - Mismas cards que en la homepage */}
            <section className="py-16 md:py-24 bg-techmedis-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-display text-techmedis-primary mb-2">
                            Explore Nuestro Catálogo
                        </h2>
                        <p className="text-techmedis-text/60">
                            Soluciones especializadas para clínicas y hospitales veterinarios
                        </p>
                    </motion.div>
                    <CategoryCardsGrid cards={veterinariaCards} />
                </div>
            </section>
        </>
    );
}

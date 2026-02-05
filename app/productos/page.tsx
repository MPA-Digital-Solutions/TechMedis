import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/categories";
import { ArrowRight, Scan, Image, Printer, Server } from "lucide-react";

export const metadata: Metadata = {
    title: "Productos - Techmedis",
    description: "Catálogo completo de productos médicos. Radiología, Mamografía, Impresoras de Películas y Sistemas PAC RIS.",
};

const categoryIcons: Record<string, React.ReactNode> = {
    radiologia: <Scan className="w-8 h-8" />,
    mamografia: <Image className="w-8 h-8" />,
    "impresoras-peliculas": <Printer className="w-8 h-8" />,
    "sistemas-pac-ris": <Server className="w-8 h-8" />,
};

const categoryDescriptions: Record<string, string> = {
    radiologia: "Equipos de radiología de última generación para diagnóstico por imágenes con la más alta calidad.",
    mamografia: "Sistemas de mamografía avanzados para detección temprana y diagnóstico preciso.",
    "impresoras-peliculas": "Impresoras de películas médicas con tecnología de punta para imágenes de alta resolución.",
    "sistemas-pac-ris": "Soluciones integrales de PACS y RIS para gestión de imágenes médicas.",
};

const categoryColors: Record<string, { gradient: string; icon: string }> = {
    radiologia: { gradient: "from-blue-500 to-blue-700", icon: "bg-blue-500/20 text-blue-500" },
    mamografia: { gradient: "from-pink-500 to-pink-700", icon: "bg-pink-500/20 text-pink-500" },
    "impresoras-peliculas": { gradient: "from-amber-500 to-amber-700", icon: "bg-amber-500/20 text-amber-500" },
    "sistemas-pac-ris": { gradient: "from-emerald-500 to-emerald-700", icon: "bg-emerald-500/20 text-emerald-500" },
};

export default function ProductosPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-techmedis-primary to-techmedis-secondary py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-display text-white mb-6">
                        Nuestros Productos
                    </h1>
                    <p className="text-xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
                        Descubra nuestra amplia gama de equipamiento médico de las mejores marcas internacionales,
                        diseñado para optimizar el diagnóstico y la atención al paciente.
                    </p>
                </div>
            </section>

            {/* Categorías */}
            <section className="py-16 md:py-24 bg-techmedis-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {CATEGORIES.map((category) => (
                            <Link
                                key={category}
                                href={`/productos/${category}`}
                                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className="relative p-8 md:p-10">
                                    <div className={`${categoryColors[category].icon} group-hover:bg-white/20 group-hover:text-white p-4 rounded-2xl w-fit mb-6 transition-colors duration-300`}>
                                        {categoryIcons[category]}
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-techmedis-primary group-hover:text-white mb-4 transition-colors duration-300">
                                        {CATEGORY_LABELS[category]}
                                    </h2>

                                    <p className="text-techmedis-text/70 group-hover:text-white/80 mb-6 transition-colors duration-300">
                                        {categoryDescriptions[category]}
                                    </p>

                                    <div className="inline-flex items-center gap-2 text-techmedis-primary group-hover:text-white font-semibold transition-colors duration-300">
                                        Ver productos
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

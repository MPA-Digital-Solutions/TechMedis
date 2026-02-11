"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Heart, Award, Monitor, Tablet, Zap } from "lucide-react";

// ==================== PRODUCTOS CARDS CONFIG ====================
export const productCards = [
    {
        id: "card-radiologia",
        title: "Radiología",
        subtitle: "Diagnóstico por Imágenes",
        description: "Equipos de radiología de última generación para diagnóstico por imágenes con la más alta calidad.",
        image: "/images/radiologiacard.webp",
        href: "/productos/radiologia",
        gradient: "from-blue-700/90 via-blue-600/40 to-transparent",
        buttonColor: "text-blue-600",
        icon: <Stethoscope className="w-5 h-5 text-white" />,
    },
    {
        id: "card-mamografia",
        title: "Mamografía",
        subtitle: "Detección Temprana",
        description: "Sistemas de mamografía avanzados para detección temprana y diagnóstico preciso.",
        image: "/images/mamografiacard.webp",
        href: "/productos/mamografia",
        gradient: "from-pink-700/90 via-pink-600/40 to-transparent",
        buttonColor: "text-pink-600",
        icon: <Heart className="w-5 h-5 text-white" />,
    },
    {
        id: "card-impresoras",
        title: "Impresoras de Películas",
        subtitle: "Impresión Médica",
        description: "Impresoras de películas médicas con tecnología de punta para imágenes de alta resolución.",
        image: "/images/impresorapelicacard.webp",
        href: "/productos/impresoras-peliculas",
        gradient: "from-amber-700/90 via-amber-600/40 to-transparent",
        buttonColor: "text-amber-600",
        icon: <Award className="w-5 h-5 text-white" />,
    },
    {
        id: "card-pacris",
        title: "Sistemas PAC RIS",
        subtitle: "Gestión de Imágenes",
        description: "Soluciones integrales de PACS y RIS para gestión de imágenes médicas.",
        image: "/images/sistemapacriscard.webp",
        href: "/productos/sistemas-pac-ris",
        gradient: "from-emerald-700/90 via-emerald-600/40 to-transparent",
        buttonColor: "text-emerald-600",
        icon: <Stethoscope className="w-5 h-5 text-white" />,
    },
];

// ==================== VETERINARIA CARDS CONFIG ====================
export const veterinariaCards = [
    {
        id: "card-digitalizacion-directa-vet",
        title: "Digitalización Directa Veterinaria",
        subtitle: "Captura Inmediata",
        description: "Sistemas de digitalización directa para diagnóstico veterinario con captura inmediata de imágenes.",
        image: "/images/digitalizaciondirectaveterinaria.webp",
        href: "/veterinaria/digitalizacion-directa-veterinaria",
        gradient: "from-green-700/90 via-green-600/40 to-transparent",
        buttonColor: "text-green-600",
        icon: <Monitor className="w-5 h-5 text-white" />,
    },
    {
        id: "card-digitalizacion-indirecta-vet",
        title: "Digitalización Indirecta Veterinaria",
        subtitle: "Tecnología CR",
        description: "Equipos de digitalización indirecta con tecnología CR para radiología veterinaria.",
        image: "/images/digitalizacionindirectaveterinaria.webp",
        href: "/veterinaria/digitalizacion-indirecta-veterinaria",
        gradient: "from-teal-700/90 via-teal-600/40 to-transparent",
        buttonColor: "text-teal-600",
        icon: <Tablet className="w-5 h-5 text-white" />,
    },
    {
        id: "card-equipos-rx-portatiles",
        title: "Equipos de RX Portátiles",
        subtitle: "Portabilidad Profesional",
        description: "Equipos de rayos X portátiles especializados para uso veterinario en campo y clínica.",
        image: "/images/rayosxportatiles.webp",
        href: "/veterinaria/equipos-rx-portatiles",
        gradient: "from-emerald-700/90 via-emerald-600/40 to-transparent",
        buttonColor: "text-emerald-600",
        icon: <Zap className="w-5 h-5 text-white" />,
    },
];

// ==================== CATEGORY CARD COMPONENT ====================
interface CategoryCardProps {
    card: typeof productCards[number];
    index: number;
    reduceMotion?: boolean;
    className?: string;
}

function CategoryCard({ card, index, reduceMotion = false, className = "" }: CategoryCardProps) {
    const animFadeInUp = reduceMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div
            initial={animFadeInUp.hidden}
            whileInView={animFadeInUp.visible}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.1 }}
            className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 ${className}`}
            id={card.id}
        >
            <div className="aspect-[16/12] sm:aspect-[16/10] overflow-hidden">
                <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        {card.icon}
                    </div>
                    <span className="text-white/80 text-sm font-medium">{card.subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                    {card.title}
                </h3>
                <p className="text-white/80 mb-5 sm:mb-6 line-clamp-2 text-sm sm:text-base">
                    {card.description}
                </p>
                <Link
                    href={card.href}
                    className={`inline-flex items-center gap-2 bg-white ${card.buttonColor} font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 transition-all group/btn text-sm sm:text-base`}
                >
                    Explorar Catálogo
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}

// ==================== CATEGORY CARDS GRID ====================
interface CategoryCardsGridProps {
    cards: typeof productCards;
    reduceMotion?: boolean;
}

export function CategoryCardsGrid({ cards, reduceMotion = false }: CategoryCardsGridProps) {
    const isOdd = cards.length % 2 !== 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {cards.map((card, index) => {
                const isLast = index === cards.length - 1;
                const shouldCenter = isLast && isOdd;

                return (
                    <div
                        key={card.id}
                        className={shouldCenter ? "lg:col-span-2 lg:flex lg:justify-center" : "w-full"}
                    >
                        <CategoryCard
                            card={card}
                            index={index}
                            reduceMotion={reduceMotion}
                            className={shouldCenter ? "lg:max-w-[calc(50%-1rem)] w-full" : "w-full"}
                        />
                    </div>
                );
            })}
        </div>
    );
}

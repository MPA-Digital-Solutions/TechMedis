"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "@/components/optimized-image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface ProductImageCarouselProps {
    mainImage: string | null;
    carouselImages: string[];
    productName: string;
}

export function ProductImageCarousel({
    mainImage,
    carouselImages,
    productName,
}: ProductImageCarouselProps) {
    // Combine main image with carousel images
    const allImages = mainImage
        ? [mainImage, ...carouselImages]
        : carouselImages;

    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultipleImages = allImages.length > 1;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (allImages.length === 0) {
        return (
            <div className="aspect-square rounded-2xl overflow-hidden bg-techmedis-light shadow-lg">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-techmedis-light to-gray-100">
                    <Package className="w-32 h-32 text-techmedis-primary/20" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-techmedis-light shadow-lg group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <OptimizedImage
                            src={allImages[currentIndex]}
                            alt={`${productName} - Imagen ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            priority={currentIndex === 0}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-techmedis-primary p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-techmedis-primary p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {currentIndex + 1} / {allImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200 ${index === currentIndex
                                    ? "ring-2 ring-techmedis-primary ring-offset-2"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                        >
                            <OptimizedImage
                                src={image}
                                alt={`${productName} - Miniatura ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                            {index === 0 && mainImage && (
                                <div className="absolute bottom-0 left-0 right-0 bg-techmedis-primary/80 text-white text-xs text-center py-0.5">
                                    Principal
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

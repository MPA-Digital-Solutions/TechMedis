import type { Metadata } from "next";
import { getProducts } from "@/lib/actions/products";
import { getWhatsAppNumber } from "@/lib/actions/config";
import { ProductsGrid } from "@/components/products-grid";
import { SubcategoryFilterClient } from "@/components/subcategory-filter-client";
import { SUBCATEGORIES } from "@/lib/categories";

// DINÁMICO: No cachear, siempre obtener datos frescos de la BD
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Radiología - Techmedis",
    description: "Equipos de radiología de alta calidad. Tecnología de vanguardia para diagnóstico por imágenes.",
};

interface PageProps {
    searchParams: Promise<{ subcategory?: string; subcategory2?: string }>;
}

export default async function RadiologiaPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const selectedSubcategory = params.subcategory;
    const selectedSubcategory2 = params.subcategory2;

    const [products, whatsappNumber] = await Promise.all([
        getProducts({ category: "radiologia", status: "active" }),
        getWhatsAppNumber(),
    ]);

    // Filtrar productos por subcategoría si se seleccionó una
    const filteredProducts = selectedSubcategory
        ? products.filter((product) => {
            const matchesSubcategory = product.subcategory === selectedSubcategory;
            if (selectedSubcategory2) {
                return matchesSubcategory && product.subcategory2 === selectedSubcategory2;
            }
            return matchesSubcategory;
        })
        : products;

    // Obtener el nombre de la subcategoría seleccionada
    const selectedSubcategoryObj = selectedSubcategory
        ? SUBCATEGORIES.radiologia.find((sub) => sub.slug === selectedSubcategory)
        : null;

    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-techmedis-primary to-techmedis-secondary py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-white mb-6">
                                Radiología
                                {selectedSubcategoryObj && (
                                    <span className="block text-2xl font-normal text-white/80 mt-2">
                                        {selectedSubcategoryObj.name}
                                    </span>
                                )}
                            </h1>
                            <p className="text-xl text-white/90 font-light leading-relaxed">
                                Equipos de radiología de última generación para diagnóstico por imágenes
                                con la más alta calidad y precisión.
                            </p>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                            <img
                                src={selectedSubcategory === "digitalizadores-directos" ? "/images/digitalizaciondirecta.webp" : "/images/radiologiacard.webp"}
                                alt="Radiología - Equipos de diagnóstico por imágenes"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Catálogo */}
            <section className="py-16 md:py-24 bg-techmedis-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filtro de Subcategorías */}
                    <SubcategoryFilterClient
                        category="radiologia"
                        currentSubcategory={selectedSubcategory}
                        currentSubcategory2={selectedSubcategory2}
                    />

                    <ProductsGrid
                        products={filteredProducts}
                        emptyMessage="No hay productos de radiología disponibles en esta subcategoría."
                        whatsappNumber={whatsappNumber}
                    />
                </div>
            </section>
        </>
    );
}

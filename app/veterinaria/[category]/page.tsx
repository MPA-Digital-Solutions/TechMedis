import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/actions/products";
import { getWhatsAppNumber } from "@/lib/actions/config";
import { ProductsGrid } from "@/components/products-grid";
import { CATEGORIES_BY_MAIN, CATEGORY_LABELS, type Category } from "@/lib/categories";

// DINÁMICO: No cachear, siempre obtener datos frescos de la BD
export const dynamic = "force-dynamic";

const veterinariaCategories = CATEGORIES_BY_MAIN["veterinaria"];

// Imagen de header por categoría veterinaria
const CATEGORY_IMAGES: Record<string, string> = {
    "digitalizacion-directa-veterinaria": "/images/digitalizaciondirectaveterinaria.webp",
    "digitalizacion-indirecta-veterinaria": "/images/digitalizacionindirectaveterinaria.webp",
    "equipos-rx-portatiles": "/images/rayosxportatiles.webp",
};

interface PageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ subcategory?: string; subcategory2?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;

    if (!veterinariaCategories.includes(category as Category)) {
        return { title: "No encontrado - Techmedis" };
    }

    const label = CATEGORY_LABELS[category as Category];
    return {
        title: `${label} - Veterinaria - Techmedis`,
        description: `Equipamiento veterinario: ${label}. Tecnología especializada para clínicas veterinarias.`,
    };
}

export function generateStaticParams() {
    return veterinariaCategories.map((category) => ({
        category,
    }));
}

export default async function VeterinariaCategoryPage({ params }: PageProps) {
    const { category } = await params;

    // Validar que la categoría sea de veterinaria
    if (!veterinariaCategories.includes(category as Category)) {
        notFound();
    }

    const categoryTyped = category as Category;

    const [products, whatsappNumber] = await Promise.all([
        getProducts({ category: categoryTyped, status: "active" }),
        getWhatsAppNumber(),
    ]);

    const label = CATEGORY_LABELS[categoryTyped];
    const headerImage = CATEGORY_IMAGES[categoryTyped] || "/images/rayosxportatiles.webp";

    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-white mb-6">
                                {label}
                            </h1>
                            <p className="text-xl text-white/90 font-light leading-relaxed">
                                Equipamiento veterinario especializado en {label.toLowerCase()} para clínicas y hospitales veterinarios.
                            </p>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-2xl h-80">
                            <img
                                src={headerImage}
                                alt={`${label} - Equipamiento veterinario`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Catálogo */}
            <section className="py-16 md:py-24 bg-techmedis-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductsGrid
                        products={products}
                        emptyMessage={`No hay productos de ${label.toLowerCase()} disponibles actualmente.`}
                        whatsappNumber={whatsappNumber}
                    />
                </div>
            </section>
        </>
    );
}

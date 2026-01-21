import type { Metadata } from "next";
import { getProducts } from "@/lib/actions/products";
import { ProductsGrid } from "@/components/products-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipamientos Clínicos - Techmedis",
  description: "Catálogo de equipamiento médico clínico. Tecnología de vanguardia para diagnóstico y tratamiento.",
};

export default async function EquiposClinicosPage() {
  const products = await getProducts({ category: "clinico", status: "active" });

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-techmedis-primary to-techmedis-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Equipamientos Clínicos
              </h1>
              <p className="text-xl text-white/90 font-light leading-relaxed">
                Tecnología médica avanzada para optimizar el diagnóstico y la atención al paciente, 
                con el respaldo de las mejores marcas internacionales.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514" 
                alt="Equipamiento Clínico" 
                className="w-full h-80 object-cover"
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
            emptyMessage="No hay equipamientos clínicos disponibles en este momento."
          />
        </div>
      </section>
    </>
  );
}

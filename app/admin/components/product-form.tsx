"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUS_OPTIONS,
  STATUS_LABELS,
  generateSlug,
  type Product,
} from "@/lib/validations/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    status: product?.status || "active",
    category: product?.category || "clinico",
  });

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      
      // Mantener imagen actual si no se cambió
      if (product?.image && imagePreview === product.image) {
        form.set("keepCurrentImage", "true");
      }

      const result = product
        ? await updateProduct(form)
        : await createProduct(form);

      if (result.success) {
        toast({
          title: product ? "Producto actualizado" : "Producto creado",
          description: "Los cambios se guardaron correctamente.",
        });
        onSuccess?.();
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Ocurrió un error inesperado",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el producto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-techmedis-primary">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {product && <input type="hidden" name="id" value={product.id} />}

          {/* Nombre y Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all"
                placeholder="Ej: Ecógrafo Doppler 4D"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all"
                placeholder="ecografo-doppler-4d"
              />
            </div>
          </div>

           {/* Descripción */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Descripción *
             </label>
             <textarea
               name="description"
               value={formData.description}
               onChange={(e) =>
                 setFormData((prev) => ({ ...prev, description: e.target.value }))
               }
               required
               rows={6}
               className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all resize-none font-mono text-sm"
               placeholder="Descripción detallada del producto...&#10;&#10;Puedes usar:&#10;- Puntos con guion y espacio (- Texto)&#10;- Números (1. Texto, 2. Texto)&#10;- Párrafos normales"
             />
             <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
               <p className="text-xs font-semibold text-blue-900 mb-2">Cómo formatear:</p>
               <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                 <li><code className="bg-blue-100 px-1 rounded">- Texto</code> para viñetas</li>
                 <li><code className="bg-blue-100 px-1 rounded">1. Texto</code> para listas numeradas</li>
                 <li>Saltos de línea se respetan</li>
                 <li>Espacios en blanco separan párrafos</li>
               </ul>
             </div>
           </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen del producto
            </label>
            {imagePreview ? (
              <div className="relative w-40 h-40">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-techmedis-primary transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Haz clic para subir una imagen</p>
                <p className="text-gray-400 text-sm">PNG, JPG hasta 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-techmedis-primary text-white rounded-lg hover:bg-techmedis-primary/90 transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

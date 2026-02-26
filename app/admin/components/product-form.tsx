"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, GripVertical, Plus, Trash2 } from "lucide-react";
import { createProduct, updateProduct, getCarouselImages, deleteCarouselImage } from "@/lib/actions/products";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUS_OPTIONS,
  STATUS_LABELS,
  SUBCATEGORIES,
  MAIN_CATEGORIES,
  MAIN_CATEGORY_LABELS,
  CATEGORIES_BY_MAIN,
  type Product,
  type Category,
} from "@/lib/validations/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CarouselImage {
  id: string;
  url: string;
  index: number;
  isNew: boolean;
  file?: File;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-");
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);

  // Carousel state
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Validate that category is one of the valid categories
  const getValidCategory = (cat?: string): Category => {
    if (cat && CATEGORIES.includes(cat as Category)) {
      return cat as Category;
    }
    return "radiologia"; // Default fallback for new products or legacy categories
  };

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    status: product?.status || "active",
    category: getValidCategory(product?.category),
    subcategory: product?.subcategory || "",
    subcategory2: product?.subcategory2 || "",
  });

  // Load existing carousel images when editing
  useEffect(() => {
    if (product?.slug) {
      getCarouselImages(product.slug).then((images) => {
        setCarouselImages(
          images.map((url, idx) => ({
            id: `existing-${idx}`,
            url,
            index: idx + 1,
            isNew: false,
          }))
        );
      });
    }
  }, [product?.slug]);

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

  // Carousel handlers
  const handleCarouselAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const currentMaxIndex = carouselImages.length > 0
      ? Math.max(...carouselImages.map(img => img.index))
      : 0;
    const batchId = Date.now();

    // Read all files and batch-add them to state
    const readPromises = fileArray.map((file, idx) => {
      return new Promise<CarouselImage>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `new-${batchId}-${idx}`,
            url: reader.result as string,
            index: currentMaxIndex + idx + 1,
            isNew: true,
            file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newImages) => {
      setCarouselImages((prev) => [...prev, ...newImages]);
    });

    // Reset input so the same files can be selected again
    if (carouselInputRef.current) {
      carouselInputRef.current.value = "";
    }
  };

  const handleCarouselRemove = async (image: CarouselImage) => {
    if (!image.isNew && product?.slug) {
      // Delete from server
      const result = await deleteCarouselImage(product.slug, image.index);
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "No se pudo eliminar la imagen",
          variant: "destructive",
        });
        return;
      }
    }
    setCarouselImages((prev) => prev.filter((img) => img.id !== image.id));
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...carouselImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update indices
    newImages.forEach((img, idx) => {
      img.index = idx + 1;
    });

    setCarouselImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

      // Add new carousel images
      const newCarouselImages = carouselImages.filter((img) => img.isNew && img.file);
      newCarouselImages.forEach((img) => {
        if (img.file) {
          form.append("carouselImages", img.file);
        }
      });

      // Add carousel order (indices of existing images in new order)
      const existingImages = carouselImages.filter((img) => !img.isNew);
      if (existingImages.length > 0) {
        const orderArray = existingImages.map((img) => {
          // Extract original index from the URL
          const match = img.url.match(/-(\d+)\.webp$/);
          return match ? parseInt(match[1], 10) : img.index;
        });
        form.set("carouselOrder", JSON.stringify(orderArray));
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

          {/* Categoría, Subcategoría y Subcategoría 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const newCategory = e.target.value as Category;
                  setFormData((prev) => ({
                    ...prev,
                    category: newCategory,
                    subcategory: "", // Reset subcategory when changing category
                    subcategory2: "" // Reset subcategory2 when changing category
                  }))
                }}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
              >
                {MAIN_CATEGORIES.map((mainCat) => (
                  <optgroup key={mainCat} label={MAIN_CATEGORY_LABELS[mainCat]}>
                    {CATEGORIES_BY_MAIN[mainCat].map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoría (opcional)
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: e.target.value,
                    subcategory2: "" // Reset subcategory2 when changing subcategory
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
              >
                <option value="">Seleccionar subcategoría...</option>
                {SUBCATEGORIES[formData.category]?.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoría 2 (opcional)
              </label>
              <select
                name="subcategory2"
                value={formData.subcategory2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subcategory2: e.target.value }))
                }
                disabled={!formData.subcategory}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar subcategoría 2...</option>
                {formData.subcategory &&
                  SUBCATEGORIES[formData.category]
                    ?.find((sub) => sub.slug === formData.subcategory)
                    ?.items?.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Estado */}
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

          {/* Imagen Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen principal del producto
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
                <p className="text-gray-400 text-sm">PNG, JPG, WebP, GIF, AVIF, TIFF, BMP hasta 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg,.webp,.gif,.avif,.tiff,.tif,.bmp,.svg,image/png,image/jpeg,image/webp,image/gif,image/avif,image/tiff,image/bmp,image/svg+xml"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Imágenes del Carousel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes del Carousel (Galería)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Arrastra las imágenes para cambiar su orden. La imagen principal siempre aparece primero.
            </p>

            {carouselImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {carouselImages.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group cursor-move ${draggedIndex === index ? "opacity-50" : ""
                      }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-techmedis-primary transition-colors">
                      <img
                        src={image.url}
                        alt={`Carousel ${image.index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Order badge */}
                    <div className="absolute top-1 left-1 bg-techmedis-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                    {/* Drag handle */}
                    <div className="absolute top-1 right-1 bg-white/80 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-gray-600" />
                    </div>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleCarouselRemove(image)}
                      className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {image.isNew && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Nueva
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => carouselInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-techmedis-primary hover:text-techmedis-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar imágenes al carousel
            </button>
            <input
              ref={carouselInputRef}
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.gif,.avif,.tiff,.tif,.bmp,.svg,image/png,image/jpeg,image/webp,image/gif,image/avif,image/tiff,image/bmp,image/svg+xml"
              onChange={handleCarouselAdd}
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

"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/products";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type Product,
  type Category,
  type ProductStatus,
} from "@/lib/validations/product";
import { useToast } from "@/components/ui/use-toast";
import { ProductForm } from "./product-form";

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setDeletingId(id);
    const result = await deleteProduct(id);

    if (result.success) {
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
    setDeletingId(null);
  };

  const handleStatusToggle = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    const result = await toggleProductStatus(product.id, newStatus);

    if (result.success) {
      toast({
        title: "Estado actualizado",
        description: `El producto ahora está ${STATUS_LABELS[newStatus as ProductStatus].toLowerCase()}.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    return category === "clinico"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No hay productos registrados</p>
        <p className="text-gray-400 text-sm mt-1">
          Crea tu primer producto para comenzar
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Producto
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Categoría
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Precio
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Estado
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Sin img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
                    >
                      {CATEGORY_LABELS[product.category as Category]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      ${product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Costo: ${product.costPrice.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${getStatusColor(product.status)}`}
                    >
                      {STATUS_LABELS[product.status as ProductStatus]}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/productos/${product.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-techmedis-primary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-gray-400 hover:text-techmedis-primary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
}

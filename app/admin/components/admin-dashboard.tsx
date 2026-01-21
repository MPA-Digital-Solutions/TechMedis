"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Plus,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { ProductsTable } from "./products-table";
import { ProductForm } from "./product-form";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  type Product,
  type Category,
} from "@/lib/validations/product";

interface AdminDashboardProps {
  initialProducts: Product[];
}

export function AdminDashboard({ initialProducts }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "productos">(
    "productos"
  );
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

  // Filtrar productos
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const stats = [
    { label: "Total Productos", value: initialProducts.length },
    {
      label: "Clínicos",
      value: initialProducts.filter((p) => p.category === "clinico").length,
    },
    {
      label: "Veterinarios",
      value: initialProducts.filter((p) => p.category === "veterinario").length,
    },
    {
      label: "Activos",
      value: initialProducts.filter((p) => p.status === "active").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-techmedis-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Techmedis Admin</h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-72px)] bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("productos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "productos"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Package className="w-5 h-5" />
              Productos
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-techmedis-primary">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "productos" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Productos
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-techmedis-primary text-white rounded-lg hover:bg-techmedis-primary/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Producto
                </button>
              </div>

              {/* Filtros */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={categoryFilter}
                      onChange={(e) =>
                        setCategoryFilter(e.target.value as Category | "all")
                      }
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
                    >
                      <option value="all">Todas las categorías</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <ProductsTable products={filteredProducts} />
            </div>
          )}
        </main>
      </div>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
